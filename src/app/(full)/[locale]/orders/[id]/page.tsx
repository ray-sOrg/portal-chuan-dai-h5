import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getOrderById, updateOrderStatus } from '@/features/order/actions/order-actions';
import { getAuth } from '@/features/auth/queries/get-auth';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { Locale } from 'next-intl';
import Link from 'next/link';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'order' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const { user } = await getAuth();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
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
          <Link href={`/${locale}/orders`} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">{order.orderNumber}</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* 订单状态 */}
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            {getStatusIcon(order.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {t(`status.${order.status.toLowerCase()}`)}
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString(locale)}
          </div>
        </div>

        {/* 客户信息 */}
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            <h3 className="font-medium">{t('guest')}</h3>
          </div>
          <p className="text-muted-foreground">{order.customerName}</p>
        </div>

        {/* 菜品列表 */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b font-medium">
            {t('items')} ({order.items.length})
          </div>
          <div className="divide-y">
            {order.items.map((item: any) => (
              <div key={item.id} className="p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{item.dishName}</div>
                  <div className="text-sm text-muted-foreground">
                    ¥{item.price.toNumber().toFixed(2)} × {item.quantity}
                  </div>
                  {item.remark && (
                    <div className="text-xs text-muted-foreground mt-1">
                      备注: {item.remark}
                    </div>
                  )}
                </div>
                <div className="font-medium">
                  ¥{(item.price.toNumber() * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          {/* 总价 */}
          <div className="p-4 bg-muted/50 border-t flex justify-between items-center">
            <span className="font-medium">{t('amount')}</span>
            <span className="text-xl font-bold">¥{order.totalAmount.toNumber().toFixed(2)}</span>
          </div>
        </div>

        {/* 备注 */}
        {order.remark && (
          <div className="bg-card rounded-xl p-4 border shadow-sm">
            <h3 className="font-medium mb-2">{t('remark')}</h3>
            <p className="text-muted-foreground">{order.remark}</p>
          </div>
        )}

        {/* 操作按钮 */}
        {order.status === 'PENDING' && (
          <div className="flex gap-3 pt-4">
            <form
              action={async () => {
                'use server';
                await updateOrderStatus(id, 'CANCELLED');
              }}
            >
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg border font-medium hover:bg-muted transition-colors"
              >
                {t('actions.cancel')}
              </button>
            </form>
            <form
              action={async () => {
                'use server';
                await updateOrderStatus(id, 'CONFIRMED');
              }}
            >
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                {t('actions.confirm')}
              </button>
            </form>
          </div>
        )}

        {order.status === 'CONFIRMED' && (
          <form
            action={async () => {
              'use server';
              await updateOrderStatus(id, 'COMPLETED');
            }}
          >
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {t('actions.complete')}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
