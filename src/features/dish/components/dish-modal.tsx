'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { toast } from 'sonner';
import type { Dish } from '@/features/dish/types';

interface DishModalProps {
  dish: Dish;
  onClose: () => void;
}

export function DishModal({ dish, onClose }: DishModalProps) {
  const t = useTranslations('menu');
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [remark, setRemark] = useState('');

  const handleAddToCart = () => {
    addItem(dish, quantity, remark || undefined);
    toast.success(t('addedToMenu'));
    onClose();
  };

  const colors = {
    primary: 'bg-red-500',
    text: 'text-red-600',
    bg: 'bg-red-50',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-background rounded-t-3xl w-full max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 rounded-full text-white hover:bg-black/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 图片 */}
        <div className="aspect-video bg-muted relative">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              📷 {dish.name}
            </div>
          )}

          {/* 分类标签 */}
          <span className={`absolute bottom-4 left-4 px-3 py-1 text-sm font-medium rounded ${colors.bg} ${colors.text}`}>
            {dish.category}
          </span>
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4 overflow-y-auto pb-32">
          {/* 标题和价格 */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{dish.name}</h2>
              {dish.nameEn && (
                <p className="text-sm text-muted-foreground">{dish.nameEn}</p>
              )}
            </div>
            <span className="text-xl font-bold text-primary">
              ¥{dish.price.toFixed(2)}
            </span>
          </div>

          {/* 描述 */}
          {dish.description && (
            <p className="text-muted-foreground">{dish.description}</p>
          )}

          {/* 标签 */}
          <div className="flex gap-2 flex-wrap">
            {dish.isSpicy && (
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                🌶️ {t('tags.spicy')}
              </span>
            )}
            {dish.isVegetarian && (
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                🥬 {t('tags.vegetarian')}
              </span>
            )}
          </div>

          {/* 数量选择 */}
          <div className="flex items-center justify-between py-2 border-t border-b">
            <span className="font-medium">数量</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="例如：不加香菜、少放辣"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {t('addToMenu')} × {quantity} · ¥{(dish.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
