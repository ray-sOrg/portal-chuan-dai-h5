import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const transaction = {
    dish: {
      findMany: vi.fn(),
    },
    gathering: {
      findFirst: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
    },
  };

  return {
    getAuth: vi.fn(),
    revalidatePath: vi.fn(),
    transaction,
    prisma: {
      $transaction: vi.fn(
        async (callback: (client: typeof transaction) => unknown) =>
          callback(transaction)
      ),
      order: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        updateMany: vi.fn(),
        findUnique: vi.fn(),
      },
    },
  };
});

vi.mock('@/features/auth/queries/get-auth', () => ({
  getAuth: mocks.getAuth,
}));

vi.mock('@/lib/prisma', () => ({
  prisma: mocks.prisma,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}));

import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '@/features/order/actions/order-actions';

const DISH_ID = '123e4567-e89b-42d3-a456-426614174000';
const ORDER_ID = '123e4567-e89b-42d3-a456-426614174001';

describe('order actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuth.mockResolvedValue({
      user: {
        id: 'user-1',
        nickname: '小明',
        phone: null,
        role: 'GUEST',
      },
    });
    mocks.transaction.user.findFirst.mockResolvedValue({ id: 'host-1' });
    mocks.transaction.gathering.findFirst.mockResolvedValue(null);
  });

  it('rejects invalid quantities before opening a transaction', async () => {
    const result = await createOrder({
      items: [{ dishId: DISH_ID, quantity: -1 }],
    });

    expect(result.success).toBe(false);
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled();
  });

  it('calculates the trusted total from current database prices', async () => {
    mocks.transaction.dish.findMany.mockResolvedValue([
      {
        id: DISH_ID,
        name: '麻婆豆腐',
        price: new Prisma.Decimal('19.90'),
        category: 'HOT_DISH',
        nutrition: null,
      },
    ]);
    mocks.transaction.order.create.mockImplementation(async ({ data }) => {
      expect(data.totalAmount.toString()).toBe('59.7');
      expect(data.hostId).toBe('host-1');
      expect(data.items.create).toEqual([
        {
          dishId: DISH_ID,
          dishName: '麻婆豆腐',
          price: new Prisma.Decimal('19.90'),
          quantity: 3,
          remark: '少辣',
        },
      ]);
      return { id: ORDER_ID, orderNumber: 'ORD-TEST' };
    });

    const result = await createOrder({
      items: [{ dishId: DISH_ID, quantity: 3, remark: '少辣' }],
    });

    expect(result).toEqual({
      success: true,
      orderId: ORDER_ID,
      orderNumber: 'ORD-TEST',
    });
    expect(mocks.transaction.dish.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: [DISH_ID] },
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        nutrition: {
          select: { basis: true, servingUnit: true },
        },
      },
    });
  });

  it('stores fitness meal grams and calculates price per 100g', async () => {
    mocks.transaction.dish.findMany.mockResolvedValue([{
      id: DISH_ID,
      name: '希腊式酸奶',
      price: new Prisma.Decimal('12.00'),
      category: 'FITNESS_MEAL',
      nutrition: { basis: 'PER_100G', servingUnit: 'g' },
    }]);
    mocks.transaction.order.create.mockImplementation(async ({ data }) => {
      expect(data.totalAmount.toString()).toBe('18');
      expect(data.items.create[0]).toMatchObject({ quantity: 1 });
      expect(data.items.create[0].weightGrams.toString()).toBe('150');
      return { id: ORDER_ID, orderNumber: 'ORD-TEST' };
    });

    const result = await createOrder({ items: [{ dishId: DISH_ID, quantity: 1, weightGrams: 150 }] });
    expect(result.success).toBe(true);
  });

  it('accepts packaged fitness meals by package count', async () => {
    mocks.transaction.dish.findMany.mockResolvedValue([{
      id: DISH_ID,
      name: '每日坚果',
      price: new Prisma.Decimal('8.00'),
      category: 'FITNESS_MEAL',
      nutrition: { basis: 'PER_SERVING', servingUnit: 'serving' },
    }]);
    mocks.transaction.order.create.mockImplementation(async ({ data }) => {
      expect(data.totalAmount.toString()).toBe('24');
      expect(data.items.create[0]).toEqual({
        dishId: DISH_ID,
        dishName: '每日坚果',
        price: new Prisma.Decimal('8.00'),
        quantity: 3,
        remark: undefined,
      });
      return { id: ORDER_ID, orderNumber: 'ORD-TEST' };
    });

    const result = await createOrder({ items: [{ dishId: DISH_ID, quantity: 3 }] });
    expect(result.success).toBe(true);
  });

  it('rejects missing or unavailable dishes', async () => {
    mocks.transaction.dish.findMany.mockResolvedValue([]);

    const result = await createOrder({
      items: [{ dishId: DISH_ID, quantity: 1 }],
    });

    expect(result).toEqual({
      success: false,
      message: '部分菜品不存在或已下架，请刷新菜单后重试',
    });
    expect(mocks.transaction.order.create).not.toHaveBeenCalled();
  });

  it('updates status only from the required previous state', async () => {
    mocks.prisma.order.updateMany.mockResolvedValue({ count: 1 });

    const result = await updateOrderStatus(ORDER_ID, 'CONFIRMED');

    expect(result).toEqual({ success: true });
    expect(mocks.prisma.order.updateMany).toHaveBeenCalledWith({
      where: {
        id: ORDER_ID,
        hostId: 'user-1',
        status: 'PENDING',
      },
      data: {
        status: 'CONFIRMED',
        confirmedAt: expect.any(Date),
      },
    });
    expect(mocks.prisma.order.findUnique).not.toHaveBeenCalled();
  });

  it('reports an invalid transition after a concurrent status change', async () => {
    mocks.prisma.order.updateMany.mockResolvedValue({ count: 0 });
    mocks.prisma.order.findUnique.mockResolvedValue({
      customerId: 'user-1',
      hostId: 'user-1',
      status: 'PENDING',
    });

    const result = await updateOrderStatus(ORDER_ID, 'COMPLEED');

    expect(result).toEqual({
      success: false,
      message: '当前订单状态不允许此操作，请刷新后重试',
    });
    expect(mocks.prisma.order.updateMany).toHaveBeenCalledWith({
      where: {
        id: ORDER_ID,
        hostId: 'user-1',
        status: 'CONFIRMED',
      },
      data: {
        status: 'COMPLEED',
      },
    });
  });

  it('allows only the customer to cancel a pending order', async () => {
    mocks.prisma.order.updateMany.mockResolvedValue({ count: 1 });

    const result = await updateOrderStatus(ORDER_ID, 'CANCELLED');

    expect(result).toEqual({ success: true });
    expect(mocks.prisma.order.updateMany).toHaveBeenCalledWith({
      where: {
        id: ORDER_ID,
        customerId: 'user-1',
        status: 'PENDING',
      },
      data: {
        status: 'CANCELLED',
      },
    });
  });

  it('does not let a customer perform host status actions', async () => {
    mocks.prisma.order.updateMany.mockResolvedValue({ count: 0 });
    mocks.prisma.order.findUnique.mockResolvedValue({
      customerId: 'user-1',
      hostId: 'host-1',
      status: 'PENDING',
    });

    const result = await updateOrderStatus(ORDER_ID, 'CONFIRMED');

    expect(result).toEqual({
      success: false,
      message: '无权操作该订单',
    });
  });

  it('scopes the host queue to orders assigned to the current user', async () => {
    mocks.prisma.order.findMany.mockResolvedValue([]);

    await getOrders({ view: 'host', status: 'PENDING' });

    expect(mocks.prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        hostId: 'user-1',
        status: 'PENDING',
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('allows order details only for the customer or assigned host', async () => {
    mocks.prisma.order.findFirst.mockResolvedValue(null);

    await getOrderById(ORDER_ID);

    expect(mocks.prisma.order.findFirst).toHaveBeenCalledWith({
      where: {
        id: ORDER_ID,
        OR: [{ customerId: 'user-1' }, { hostId: 'user-1' }],
      },
      include: {
        items: true,
      },
    });
  });
});
