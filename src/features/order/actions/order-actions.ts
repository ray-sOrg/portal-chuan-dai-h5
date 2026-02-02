'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import { redirect } from 'next/navigation';

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${dateStr}-${random}`;
}

/**
 * 创建订单
 */
export async function createOrder(data: {
  items: { dishId: string; quantity: number; remark?: string }[];
  remark?: string;
  customerName?: string;
}) {
  const { user } = await getAuth();

  if (!user) {
    return { success: false, message: '请先登录', redirectTo: '/sign-in' };
  }

  if (data.items.length === 0) {
    return { success: false, message: '购物车为空' };
  }

  // 获取菜品信息并计算总价
  let totalAmount = 0;
  const orderItems: {
    dishId: string;
    dishName: string;
    price: number;
    quantity: number;
    remark?: string;
  }[] = [];

  for (const item of data.items) {
    const dish = await prisma.dish.findUnique({
      where: { id: item.dishId },
    });

    if (!dish) {
      return { success: false, message: `菜品不存在: ${item.dishId}` };
    }

    const price = typeof dish.price === 'number' ? dish.price : dish.price.toNumber();
    totalAmount += price * item.quantity;

    orderItems.push({
      dishId: dish.id,
      dishName: dish.name,
      price,
      quantity: item.quantity,
      remark: item.remark,
    });
  }

  // 创建订单（简化版，无需聚会）
  const userAny = user as any;
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: user.id,
      customerName: data.customerName || userAny.nickname || userAny.account || 'Guest',
      totalAmount,
      remark: data.remark,
      items: {
        create: orderItems.map((item) => ({
          dishId: item.dishId,
          dishName: item.dishName,
          price: item.price,
          quantity: item.quantity,
          remark: item.remark,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  revalidatePath('/orders');
  
  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
  };
}

/**
 * 获取订单列表（根据用户角色）
 */
export async function getOrders(options?: {
  status?: string;
  hostId?: string;
  customerId?: string;
}) {
  const { user } = await getAuth();

  if (!user) return [];

  // 如果是主人，查自己发布的聚会的订单
  // 如果是客户，查自己的订单
  const where: any = {
    customerId: user.id,
  };

  if (options?.status) {
    where.status = options.status;
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

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) return null;

  // 检查权限（只有订单主人可以查看）
  if (order.customerId !== user.id) {
    return null;
  }

  return order;
}

/**
 * 更新订单状态（主人操作）
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
) {
  const { user } = await getAuth();

  if (!user) {
    return { success: false, message: '请先登录' };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return { success: false, message: '订单不存在' };
  }

  // 检查是否是订单主人
  if (order.customerId !== user.id) {
    return { success: false, message: '只有订单主人可以操作' };
  }

  const updateData: any = { status };
  
  if (status === 'CONFIRMED') {
    updateData.confirmedAt = new Date();
  }

  await prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });

  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);

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
