'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Heart, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme';
import { LanguageToggle } from '@/components/language-toggle';
import { CartFloating } from '@/features/cart/components/cart-floating';
import { DishModal } from '@/features/dish/components/dish-modal';
import { toggleDishFavorite } from '@/features/dish/actions/dish-actions';
import { DISH_CATEGORIES, getCategoryTheme } from '@/features/dish/data/dishes';
import type { Dish, DishCategory } from '@/features/dish/types';

interface MenuClientProps {
  initialDishes: Dish[];
  initialFavorites: Set<string>;
}

export function MenuClient({ initialDishes, initialFavorites }: MenuClientProps) {
  const t = useTranslations();

  // 状态
  const [activeCategory, setActiveCategory] = useState<DishCategory | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(initialFavorites);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);

  // 筛选后的菜品
  const filteredDishes = useMemo(() => {
    if (activeCategory === 'all') return dishes;
    return dishes.filter((dish) => dish.category === activeCategory);
  }, [dishes, activeCategory]);

  // 虚拟滚动
  const rowVirtualizer = useVirtualizer({
    count: filteredDishes.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 280,
    overscan: 5,
  });

  // 收藏处理
  const handleToggleFavorite = useCallback(async (dishId: string) => {
    const result = await toggleDishFavorite(dishId);
    if (result.success) {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (result.isFavorite) {
          next.add(dishId);
          toast.success(t('menu.favorited'));
        } else {
          next.delete(dishId);
          toast.success(t('menu.unfavorite'));
        }
        return next;
      });
    }
  }, [t]);

  // 打开菜品详情
  const handleOpenDish = useCallback((dish: Dish) => {
    setSelectedDish(dish);
  }, []);

  // 获取主题色
  const getThemeColors = (category: DishCategory) => {
    const theme = getCategoryTheme(category);
    return theme === 'sichuan'
      ? { primary: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
      : { primary: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  // 空状态
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="flex-shrink-0 p-4 border-b">
          <div className="container mx-auto flex items-center gap-4">
            <ChevronLeft className="w-5 h-5" />
            <h1 className="text-xl font-bold">{t('common.menu')}</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">{t('menu.empty')}</p>
            <p className="text-sm">暂无菜品</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChevronLeft className="w-5 h-5" />
            <h1 className="text-xl font-bold">{t('common.menu')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 分类筛选 */}
      <div className="flex-shrink-0 px-4 py-3 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* 全部 */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {t('menu.categories.all')}
            </button>

            {/* 分类列表 */}
            {DISH_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              const colors = getThemeColors(category.id);

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? `${colors.primary} text-white`
                      : `${colors.bg} ${colors.text} hover:opacity-80`
                  }`}
                >
                  {t(category.labelKey)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 菜品列表 */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full px-4 pb-24">
          <div ref={scrollParentRef} className="h-full container mx-auto overflow-y-auto">
            {filteredDishes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {t('menu.empty')}
              </div>
            ) : (
              <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const dish = filteredDishes[virtualRow.index];
                  const isFavorite = favorites.has(dish.id);
                  const colors = getThemeColors(dish.category);

                  return (
                    <div
                      key={dish.id}
                      className="absolute top-0 left-0 w-full px-2 pb-4"
                      style={{ transform: `translateY(${virtualRow.start}px)` }}
                    >
                      <div 
                        className="bg-card rounded-xl overflow-hidden border shadow-sm cursor-pointer"
                        onClick={() => handleOpenDish(dish)}
                      >
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

                          {/* 收藏按钮 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(dish.id);
                            }}
                            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isFavorite
                                ? 'bg-red-500 text-white'
                                : 'bg-background/80 text-muted-foreground hover:bg-background'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                          </button>

                          {/* 分类标签 */}
                          <span
                            className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded ${
                              colors.bg + ' ' + colors.text
                            }`}
                          >
                            {t(DISH_CATEGORIES.find((c) => c.id === dish.category)?.labelKey || '')}
                          </span>
                        </div>

                        {/* 内容 */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{dish.name}</h3>
                              {dish.nameEn && (
                                <p className="text-sm text-muted-foreground">{dish.nameEn}</p>
                              )}
                            </div>
                            <span className="text-lg font-bold text-primary">
                              ¥{typeof dish.price === 'number' ? dish.price.toFixed(2) : dish.price}
                            </span>
                          </div>

                          {/* 标签 */}
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {dish.isSpicy && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
                                🌶️ {t('menu.tags.spicy')}
                              </span>
                            )}
                            {dish.isVegetarian && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600">
                                🥬 {t('menu.tags.vegetarian')}
                              </span>
                            )}
                          </div>

                          {/* 描述 */}
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {dish.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 购物车浮动按钮 */}
      <CartFloating />

      {/* 菜品详情弹窗 */}
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}
