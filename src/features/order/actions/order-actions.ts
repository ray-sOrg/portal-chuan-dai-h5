'use server';

import { randomUUID } from 'node:crypto';
import { Prisma, type OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import {
  createOrderInputSchema,
  getRequiredPreviousStatus,
  orderIdSchema,
  orderStatusSchema,
  orderViewSchema,
  updateOrderStatusInputSchema,
  type CreateOrderInput,
  type OrderView,
  type UpdateOrderStatus,
} from '../order-rules';

type CreateOrderResult =
  | {
      success: true;
      orderId: string;
      orderNumber: string;
    }
  | {
      success: false;
      message: string;
      redirectTo?: '/sign-in';
    };

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase();
  return `ORD-${dateStr}-${suffix}`;
}

/**
 * 创建订单
 */
export async function createOrder(
  data: CreateOrderInput
): Promise<CreateOrderResult> {
  const { user } = await getAuth();

  if (!user) {
    return { success: false, message: '请先登录', redirectTo: '/sign-in' };
  }

  const parsed = createOrderInputSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || '订单参数无效',
    };
  }

  try {
    const order = await prisma.$transaction(async (transaction) => {
      const [dishes, destination] = await Promise.all([
        transaction.dish.findMany({
          where: {
            id: { in: parsed.data.items.map((item) => item.dishId) },
            isAvailable: true,
          },
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
            nutrition: { select: { basis: true, servingUnit: true } },
          },
        }),
        parsed.data.gatheringId
          ? transaction.gathering.findFirst({
              where: {
                id: parsed.data.gatheringId,
                isActive: true,
              },
              select: {
                id: true,
                hostId: true,
              },
            })
          : transaction.user.findFirst({
              where: { role: 'HOST' },
              orderBy: { createdAt: 'asc' },
              select: { id: true },
            }),
      ]);

      if (dishes.length !== parsed.data.items.length) {
        throw new Error('DISH_UNAVAILABLE');
      }
      if (!destination) {
        throw new Error('ORDER_HOST_UNAVAILABLE');
      }

      const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
      const orderItems = parsed.data.items.map((item) => {
        const dish = dishById.get(item.dishId);
        if (!dish) {
          throw new Error('DISH_UNAVAILABLE');
        }

        const isFitness = dish.category === 'FITNESS_MEAL';
        if (
          isFitness &&
          (item.quantity !== 1 ||
            !item.weightGrams ||
            dish.nutrition?.basis !== 'PER_100G' ||
            dish.nutrition.servingUnit !== 'g')
        ) {
          throw new Error('FITNESS_WEIGHT_REQUIRED');
        }
        if (!isFitness && item.weightGrams !== undefined) {
          throw new Error('FITNESS_WEIGHT_INVALID');
        }

        return {
          dishId: dish.id,
          dishName: dish.name,
          price: dish.price,
          quantity: isFitness ? 1 : item.quantity,
          ...(isFitness ? { weightGrams: new Prisma.Decimal(item.weightGrams!) } : {}),
          remark: item.remark,
        };
      });

      const totalAmount = orderItems.reduce(
        (total, item) =>
          total.plus(
            item.price.times(
              'weightGrams' in item
                ? item.weightGrams!.div(100)
                : item.quantity
            )
          ),
        new Prisma.Decimal(0)
      ).toDecimalPlaces(2);

      return transaction.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: user.id,
          hostId:
            'hostId' in destination ? destination.hostId : destination.id,
          gatheringId: parsed.data.gatheringId,
          customerName:
            parsed.data.customerName ||
            user.nickname ||
            user.phone ||
            'Guest',
          totalAmount,
          remark: parsed.data.remark,
          items: {
            create: orderItems,
          },
        },
        select: {
          id: true,
          orderNumber: true,
        },
      });
    });

    revalidatePath('/orders');

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'DISH_UNAVAILABLE') {
      return {
        success: false,
        message: '部分菜品不存在或已下架，请刷新菜单后重试',
      };
    }
    if (
      error instanceof Error &&
      (error.message === 'FITNESS_WEIGHT_REQUIRED' ||
        error.message === 'FITNESS_WEIGHT_INVALID')
    ) {
      return { success: false, message: '健身菜请填写实际食用克重后再提交' };
    }
    if (
      error instanceof Error &&
      error.message === 'ORDER_HOST_UNAVAILABLE'
    ) {
      return {
        success: false,
        message: parsed.data.gatheringId
          ? '聚会不存在或已结束，请刷新后重试'
          : '暂未配置接单主人，请联系管理员',
      };
    }

    console.error('Create order error:', error);
    return { success: false, message: '订单提交失败，请稍后重试' };
  }
}

/**
 * 获取订单列表（根据用户角色）
 */
export async function getOrders(options?: {
  status?: OrderStatus;
  view?: OrderView;
}) {
  const { user } = await getAuth();

  if (!user) return [];

  const parsedView = orderViewSchema.safeParse(options?.view ?? 'accessible');
  if (!parsedView.success) return [];

  const where: Prisma.OrderWhereInput =
    parsedView.data === 'customer'
      ? { customerId: user.id }
      : parsedView.data === 'host'
        ? { hostId: user.id }
        : {
            OR: [{ customerId: user.id }, { hostId: user.id }],
          };

  if (options?.status) {
    const parsedStatus = orderStatusSchema.safeParse(options.status);
    if (!parsedStatus.success) return [];
    where.status = parsedStatus.data;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
}

/**
 * 获取单个订单
 */
export async function getOrderById(orderId: string) {
  const { user } = await getAuth();

  if (!user) return null;

  const parsedOrderId = orderIdSchema.safeParse(orderId);
  if (!parsedOrderId.success) return null;

  return prisma.order.findFirst({
    where: {
      id: parsedOrderId.data,
      OR: [{ customerId: user.id }, { hostId: user.id }],
    },
    include: {
      items: true,
    },
  });
}

/**
 * 顾客可以取消待处理订单，主人可以确认和完成订单。
 */
export async function updateOrderStatus(
  orderId: string,
  status: UpdateOrderStatus
) {
  const { user } = await getAuth();

  if (!user) {
    return { success: false, message: '请先登录' };
  }

  const parsed = updateOrderStatusInputSchema.safeParse({ orderId, status });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || '订单状态参数无效',
    };
  }

  const requiredPreviousStatus = getRequiredPreviousStatus(parsed.data.status);
  const actorWhere =
    parsed.data.status === 'CANCELLED'
      ? { customerId: user.id }
      : { hostId: user.id };
  const updateData: Prisma.OrderUpdateManyMutationInput = {
    status: parsed.data.status,
  };

  if (parsed.data.status === 'CONFIRMED') {
    updateData.confirmedAt = new Date();
  }

  const result = await prisma.order.updateMany({
    where: {
      id: parsed.data.orderId,
      ...actorWhere,
      status: requiredPreviousStatus,
    },
    data: updateData,
  });

  if (result.count === 0) {
    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      select: { customerId: true, hostId: true, status: true },
    });

    if (!order) {
      return { success: false, message: '订单不存在' };
    }
    const isAuthorized =
      parsed.data.status === 'CANCELLED'
        ? order.customerId === user.id
        : order.hostId === user.id;
    if (!isAuthorized) {
      return { success: false, message: '无权操作该订单' };
    }
    return {
      success: false,
      message: '当前订单状态不允许此操作，请刷新后重试',
    };
  }

  revalidatePath('/orders');
  revalidatePath(`/orders/${parsed.data.orderId}`);

  return { success: true };
}

/**
 * 创建聚会
 */
export async function createGathering(data: {
  title: string;
  description?: string;
  date: Date;
  location?: string;
}) {
  const { user } = await getAuth();

  if (!user) {
    return { success: false, message: '请先登录' };
  }
  if (user.role !== 'HOST') {
    return { success: false, message: '只有主人可以创建聚会' };
  }

  // 生成邀请码
  const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();

  const gathering = await prisma.gathering.create({
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      inviteCode,
      hostId: user.id,
    },
  });

  return {
    success: true,
    gatheringId: gathering.id,
    inviteCode: gathering.inviteCode,
  };
}
