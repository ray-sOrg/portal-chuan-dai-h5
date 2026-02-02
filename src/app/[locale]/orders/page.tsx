import { Suspense } from 'react';
import { getOrders } from '@/features/order/actions/order-actions';
import { ChevronLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getAuth } from '@/features/auth/queries/get-auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

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

  // 获取待处理订单（所有人可见自己的待处理订单）
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 p-4">
          <Link href={`/${locale}/menu`} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">{t('title')}</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 待处理订单 */}
        {pendingOrders.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {t('pendingOrders')}
            </h2>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/${locale}/orders/${order.id}`}
                  className="block bg-card rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{order.orderNumber}</span>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t(`status.${order.status.toLowerCase()}`)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.items.length} {t('items')} · ¥{order.totalAmount.toNumber().toFixed(2)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 全部订单 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">{t('allOrders')}</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('empty')}
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/${locale}/orders/${order.id}`}
                  className="block bg-card rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{order.orderNumber}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t(`status.${order.status.toLowerCase()}`)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{order.items.length} {t('items')}</span>
                    <span className="font-medium">¥{order.totalAmount.toNumber().toFixed(2)}</span>
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString(locale)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
