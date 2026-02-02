'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { toast } from 'sonner';
import { createOrder } from '@/features/order/actions/order-actions';

export function CartFloating() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { items, removeItem, updateQuantity, getTotal, clearCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const total = getTotal();

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await createOrder({
        items: items.map((item) => ({
          dishId: item.dish.id,
          quantity: item.quantity,
          remark: item.remark,
        })),
      });

      if (result.success) {
        toast.success(`订单提交成功！订单号：${result.orderNumber}`);
        clearCart();
        setIsOpen(false);
        // 跳转到订单页面
        window.location.href = `/orders`;
      } else {
        toast.error(result.message || '下单失败');
      }
    } catch (error) {
      toast.error('下单失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemCount === 0) return null;

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        </div>
      </button>

      {/* 购物车面板 */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* 遮罩 */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 购物车内容 */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[70vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {t('cart.title')} ({itemCount})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 购物车列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {t('cart.empty')}
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.dish.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                      {/* 菜品信息 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.dish.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ¥{item.dish.price.toFixed(2)} x {item.quantity}
                        </p>
                        {item.remark && (
                          <p className="text-xs text-muted-foreground mt-1">
                            备注: {item.remark}
                          </p>
                        )}
                      </div>

                      {/* 数量控制 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-muted"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-muted"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 删除按钮 */}
                      <button
                        onClick={() => removeItem(item.dish.id)}
                        className="p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-4">
              {/* 总价 */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('cart.total')}</span>
                <span className="text-xl font-bold">¥{total.toFixed(2)}</span>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  {t('cart.clear')}
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || items.length === 0}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? t('cart.submitting') : t('cart.submit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
