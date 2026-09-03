import { Prisma } from '@prisma/client';
import { getOrders } from '@/features/order/actions/order-actions';
import { Locale } from 'next-intl';
import { redirect } from 'next/navigation';
import { getAuth } from '@/features/auth/queries/get-auth';
import { OrdersPageClient } from './orders-client';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

// 转换 Prisma Decimal 为普通数字
function serializeOrder(order: OrderWithItems) {
  return {
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
      weightGrams: item.weightGrams?.toNumber() ?? null,
    })),
  };
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const { user } = await getAuth();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const [orders, pendingOrders] = await Promise.all([
    getOrders({ view: 'accessible' }),
    getOrders({ view: 'host', status: 'PENDING' }),
  ]);
  const serializedOrders = orders.map(serializeOrder);
  const serializedPendingOrders = pendingOrders.map(serializeOrder);

  return (
    <OrdersPageClient 
      locale={locale}
      orders={serializedOrders}
      pendingOrders={serializedPendingOrders}
    />
  );
}
