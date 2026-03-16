import { getOrders } from '@/features/order/actions/order-actions';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getAuth } from '@/features/auth/queries/get-auth';
import { prisma } from '@/lib/prisma';
import { OrdersPageClient } from './orders-client';

// 转换 Prisma Decimal 为普通数字
function serializeOrder(order: any) {
  return {
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    items: order.items?.map((item: any) => ({
      ...item,
      price: item.price.toNumber(),
    })) || [],
  };
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'order' });
  const { user } = await getAuth();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  // 获取订单列表
  const orders = await getOrders();
  const serializedOrders = orders.map(serializeOrder);

  // 获取待处理订单
  const pendingOrders = await prisma.order.findMany({
    where: {
      status: 'PENDING',
      customerId: user.id,
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  const serializedPendingOrders = pendingOrders.map(serializeOrder);

  return (
    <OrdersPageClient 
      locale={locale}
      orders={serializedOrders}
      pendingOrders={serializedPendingOrders}
    />
  );
}
