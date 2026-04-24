'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search, Plus, Flame, Leaf, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { CartFloating } from '@/features/cart/components/cart-floating';
import { DishModal } from '@/features/dish/components/dish-modal';
import { toggleDishFavorite } from '@/features/dish/actions/dish-actions';
import { DISH_CATEGORIES, getCategoryTheme, type Dish } from '@/features/dish/data/dishes';
import type { DishCategory } from '@/features/dish/types';

interface MenuClientProps {
  initialDishes: Dish[];
  initialFavorites: Set<string>;
}

export function MenuClient({ initialDishes, initialFavorites }: MenuClientProps) {
  const t = useTranslations();
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DishCategory>(DISH_CATEGORIES[0].id);
  const [favorites, setFavorites] = useState<Set<string>>(initialFavorites);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishes] = useState<Dish[]>(initialDishes);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const copy = locale === 'zh'
    ? {
        hot: '热辣',
        fresh: '清鲜',
        dishes: '道菜',
      }
    : {
        hot: 'Hot',
        fresh: 'Fresh',
        dishes: 'dishes',
      };

  // 点击左侧分类时，右侧会产生一串 smooth-scroll 事件；滚动稳定前先锁住反向同步，避免高亮来回跳。
  const programmaticScrollRef = useRef<{
    category: DishCategory;
    targetTop: number;
    timeoutId: ReturnType<typeof setTimeout> | null;
  } | null>(null);

  const leftNavRef = useRef<HTMLDivElement>(null);
  const rightListRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<DishCategory, HTMLDivElement>>(new Map());
  const categoryBtnRefs = useRef<Map<DishCategory, HTMLButtonElement>>(new Map());

  // 筛选后的菜品
  const filteredDishes = useMemo(() => {
    let result = dishes;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.nameEn?.toLowerCase().includes(query) ||
          dish.description?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [dishes, searchQuery]);

  // 按分类分组菜品
  const dishesByCategory = useMemo(() => {
    const map = new Map<DishCategory, Dish[]>();
    DISH_CATEGORIES.forEach((cat) => {
      map.set(cat.id, []);
    });
    filteredDishes.forEach((dish) => {
      const list = map.get(dish.category);
      if (list) list.push(dish);
    });
    return map;
  }, [filteredDishes]);
  // 左侧导航：将激活分类滚动到可见中央
  const scrollLeftNavToActive = useCallback((category: DishCategory) => {
    const btn = categoryBtnRefs.current.get(category);
    const nav = leftNavRef.current;
    if (!btn || !nav) return;
    const btnTop = btn.offsetTop;
    const btnHeight = btn.offsetHeight;
    const navHeight = nav.clientHeight;
    nav.scrollTo({ top: btnTop - navHeight / 2 + btnHeight / 2, behavior: 'smooth' });
  }, []);

  const releaseProgrammaticScroll = useCallback(() => {
    const lock = programmaticScrollRef.current;
    if (lock?.timeoutId) {
      clearTimeout(lock.timeoutId);
    }
    programmaticScrollRef.current = null;
  }, []);

  // 右侧滚动 → 同步左侧高亮（scroll 事件）
  useEffect(() => {
    const container = rightListRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const scrollLock = programmaticScrollRef.current;
        if (scrollLock) {
          if (Math.abs(container.scrollTop - scrollLock.targetTop) <= 2) {
            setActiveCategory(scrollLock.category);
            releaseProgrammaticScroll();
          }
          return;
        }

        const containerTop = container.getBoundingClientRect().top;

        // 简单逻辑：找最后一个 section top 已滚过容器顶部的分类
        let current: DishCategory | null = null;
        for (const { id } of DISH_CATEGORIES) {
          const el = categoryRefs.current.get(id);
          if (!el) continue;
          const elTop = el.getBoundingClientRect().top - containerTop;
          if (elTop <= 10) {
            current = id;
          } else {
            break;
          }
        }

        if (!current && DISH_CATEGORIES.length > 0) {
          current = DISH_CATEGORIES[0].id;
        }

        if (current) {
          setActiveCategory((prev) => {
            if (prev !== current) scrollLeftNavToActive(current!);
            return current!;
          });
        }
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [dishesByCategory, releaseProgrammaticScroll, scrollLeftNavToActive]);

  // 收藏
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

  const handleOpenDish = useCallback((dish: Dish) => {
    setSelectedDish(dish);
  }, []);

  // 下拉刷新 - 原生实现
  const [pullY, setPullY] = useState(0);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const container = rightListRef.current;
    if (!container || container.scrollTop > 0) return;
    startYRef.current = e.touches[0].clientY;
    pullingRef.current = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pullingRef.current) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY > 0) {
      setPullY(Math.min(deltaY * 0.5, 100));
    }
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (!pullingRef.current) return;
    pullingRef.current = false;
    
    if (pullY > 60) {
      setIsRefreshing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(t('menu.refreshed'));
      } catch {
        toast.error(t('menu.refreshError'));
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullY(0);
  }, [pullY, t]);

  // 点击左侧分类 → 右侧滚动到对应锚点
  const handleCategoryClick = useCallback((category: DishCategory) => {
    setActiveCategory(category);

    const element = categoryRefs.current.get(category);
    const container = rightListRef.current;
    if (!element || !container) return;

    releaseProgrammaticScroll();

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const maxTop = container.scrollHeight - container.clientHeight;
    const targetTop = Math.max(
      0,
      Math.min(maxTop, container.scrollTop + elementRect.top - containerRect.top)
    );

    programmaticScrollRef.current = {
      category,
      targetTop,
      timeoutId: setTimeout(() => {
        setActiveCategory(category);
        programmaticScrollRef.current = null;
      }, 900),
    };

    container.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, [releaseProgrammaticScroll]);

  useEffect(() => releaseProgrammaticScroll, [releaseProgrammaticScroll]);

  // 空状态
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
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
    <div
      className="-mt-2 flex flex-col overflow-hidden bg-background text-foreground"
      style={{ height: 'calc(100dvh - 5.5rem)' }}
    >
      <div className="flex-none px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索菜品"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="themed-input h-10 pl-11 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden px-4 pb-2">
        <aside
          ref={leftNavRef}
          className="mr-2 w-[74px] flex-none overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="space-y-1.5 pb-4">
          {DISH_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            const categoryTheme = getCategoryTheme(category.id);
            const Icon = categoryTheme === 'sichuan' ? Flame : Leaf;

            return (
              <button
                key={category.id}
                ref={(el) => { if (el) categoryBtnRefs.current.set(category.id, el); }}
                onClick={() => handleCategoryClick(category.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full rounded-[1rem] border px-1.5 py-2.5 text-center transition-all duration-200 ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                    : 'surface-chip text-muted-foreground hover:-translate-y-0.5 hover:text-primary'
                }`}
              >
                <div className="mb-1 flex justify-center">
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <span className={`text-[11px] leading-tight font-medium ${isActive ? 'font-semibold text-primary-foreground' : ''}`}>
                  {t(category.labelKey)}
                </span>
              </button>
            );
          })}
          </div>
        </aside>

        <main
          ref={rightListRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {(pullY > 0 || isRefreshing) && (
            <div 
              className="sticky top-0 left-0 right-0 z-10 flex items-center justify-center py-3"
            >
              <div className="surface-chip rounded-full px-4 py-2 text-sm font-medium text-primary">
                {isRefreshing ? '刷新中...' : pullY > 60 ? '松开刷新' : '下拉刷新'}
              </div>
            </div>
          )}

          {DISH_CATEGORIES.map((category) => {
            const categoryDishes = dishesByCategory.get(category.id) || [];
            if (categoryDishes.length === 0 && searchQuery) return null;

            const categoryTheme = getCategoryTheme(category.id);
            const AccentIcon = categoryTheme === 'sichuan' ? Flame : Leaf;

            return (
              <div
                key={category.id}
                data-category={category.id}
                ref={(el) => { if (el) categoryRefs.current.set(category.id, el); }}
                className="mb-4"
              >
                <div className="mb-2 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <AccentIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {t(category.labelKey)}
                      </h2>
                      <p className="text-[11px] text-muted-foreground">{categoryDishes.length} {copy.dishes}</p>
                    </div>
                  </div>
                </div>

                {categoryDishes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {categoryDishes.map((dish) => {
                      const isFavorite = favorites.has(dish.id);
                      return (
                        <div
                          key={dish.id}
                          className="card-base cursor-pointer overflow-hidden rounded-[calc(var(--radius)-0.05rem)] p-0 active:scale-[0.985] transition-transform"
                          onClick={() => handleOpenDish(dish)}
                        >
                          <div className="relative aspect-[0.92] overflow-hidden bg-[linear-gradient(145deg,var(--hero-start),var(--hero-end))]">
                            <img
                              src={dish.image || ''}
                              alt={dish.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className={`absolute inset-0 flex h-full w-full flex-col items-center justify-center ${dish.image ? 'hidden' : ''}`}>
                              <Sparkles className="h-10 w-10 text-primary/35" />
                              <span className="mt-2 text-[11px] text-primary/50">暂无图片</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(dish.id); }}
                              className="surface-chip absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full"
                            >
                              <span className={isFavorite ? 'text-red-500' : 'text-gray-400'} style={{ fontSize: 13 }}>
                                {isFavorite ? '❤️' : '🤍'}
                              </span>
                            </button>
                          </div>

                          <div className="p-3">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                                {dish.name}
                              </h3>
                              <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                {categoryTheme === 'sichuan' ? copy.hot : copy.fresh}
                              </span>
                            </div>
                            <p className="line-clamp-2 min-h-[2.5rem] text-[11px] leading-5 text-muted-foreground">
                              {dish.description || dish.nameEn || ''}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] text-muted-foreground">
                                {dish.isSpicy ? '🌶️ 辣' : ''}{dish.isVegetarian ? ' 🥬 素' : ''}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenDish(dish); }}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center text-sm text-gray-400">暂无菜品</div>
                )}
              </div>
            );
          })}
          <div style={{ minHeight: 'calc(100% - 120px)' }} />
        </main>
      </div>

      <CartFloating />

      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}
