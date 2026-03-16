'use client';

import { useRouter } from '@/i18n/routing';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: any[];
  totalAmount: any;
  createdAt: Date;
}

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        暂无订单
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.slice(0, 5).map((order) => (
        <button
          key={order.id}
          onClick={() => window.location.href = `/zh/orders/${order.id}`}
          className="w-full block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">{order.orderNumber}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{order.items.length} 件商品</span>
            <span className="font-semibold text-primary">¥{order.totalAmount.toString()}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </button>
      ))}
      {orders.length > 5 && (
        <button
          onClick={() => window.location.href = '/zh/orders'}
          className="w-full block text-center text-primary text-sm font-medium hover:underline"
        >
          查看全部订单 →
        </button>
      )}
    </div>
  );
}
