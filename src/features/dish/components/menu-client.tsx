'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Plus } from 'lucide-react';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DishCategory>(DISH_CATEGORIES[0].id);
  const [favorites, setFavorites] = useState<Set<string>>(initialFavorites);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishes] = useState<Dish[]>(initialDishes);

  // 是否正在通过点击左侧导航触发滚动（期间不响应滚动事件反向同步）
  const isClickScrollingRef = useRef(false);

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
        if (isClickScrollingRef.current) return;

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
  }, [dishesByCategory, scrollLeftNavToActive]);

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

  // 点击左侧分类 → 右侧滚动到对应锚点
  const handleCategoryClick = useCallback((category: DishCategory) => {
    setActiveCategory(category);
    scrollLeftNavToActive(category);

    const element = categoryRefs.current.get(category);
    const container = rightListRef.current;
    if (!element || !container) return;

    isClickScrollingRef.current = true;
    // 计算目标 scrollTop：分类 section 顶部相对于滚动容器
    const targetTop = element.offsetTop - container.offsetTop;
    container.scrollTo({ top: targetTop, behavior: 'smooth' });

    // smooth scroll 大约 500ms，之后恢复响应
    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 600);
  }, [scrollLeftNavToActive]);

  // 空状态
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#F5F0E8]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">{t('menu.empty')}</p>
            <p className="text-sm">暂无菜品</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 整体高度 = 100dvh - header pt-12(3rem) - footer paddingBottom(calc(3.5rem + 1rem))
    <div
      className="flex flex-col bg-[#F5F0E8] text-foreground overflow-hidden"
      style={{ height: 'calc(100dvh - 3rem - 3.5rem - 1rem)' }}
    >
      {/* 搜索栏 */}
      <div className="flex-none px-4 py-3 bg-[#F5F0E8]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索菜品"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-white border border-[#E8E0D5] text-sm focus:outline-none focus:border-[#D4A853]"
          />
        </div>
      </div>

      {/* 左右联动内容区 — flex-1 + min-h-0 确保不撑开父容器 */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* 左侧分类导航 */}
        <aside
          ref={leftNavRef}
          className="w-[72px] flex-none bg-[#EEEBE3] overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {DISH_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                ref={(el) => { if (el) categoryBtnRefs.current.set(category.id, el); }}
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full min-h-[56px] px-1 flex flex-col items-center justify-center text-center gap-0.5 transition-colors border-l-[3px] ${
                  isActive
                    ? 'bg-white border-[#D4A853] text-[#8B6914]'
                    : 'border-transparent text-gray-500'
                }`}
              >
                <span className={`text-xs leading-tight font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {t(category.labelKey)}
                </span>
              </button>
            );
          })}
        </aside>

        {/* 右侧菜品列表 */}
        <main
          ref={rightListRef}
          className="flex-1 overflow-y-auto bg-[#F5F0E8]"
          style={{ scrollbarWidth: 'none' }}
        >
          {DISH_CATEGORIES.map((category) => {
            const categoryDishes = dishesByCategory.get(category.id) || [];
            if (categoryDishes.length === 0 && searchQuery) return null;

            return (
              <div
                key={category.id}
                data-category={category.id}
                ref={(el) => { if (el) categoryRefs.current.set(category.id, el); }}
              >
                {/* 分类标题行 */}
                <div className="px-3 py-2 bg-[#EDE8DF]">
                  <h2 className="text-sm font-semibold text-gray-800">
                    {t(category.labelKey)}
                  </h2>
                </div>

                {/* 菜品网格 */}
                {categoryDishes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {categoryDishes.map((dish) => {
                      const isFavorite = favorites.has(dish.id);
                      return (
                        <div
                          key={dish.id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                          onClick={() => handleOpenDish(dish)}
                        >
                          {/* 图片 */}
                          <div className="aspect-square bg-gray-100 relative">
                            {dish.image ? (
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                                🍽️
                              </div>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(dish.id); }}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-white/80"
                            >
                              <span className={isFavorite ? 'text-red-500' : 'text-gray-400'} style={{ fontSize: 13 }}>
                                {isFavorite ? '❤️' : '🤍'}
                              </span>
                            </button>
                          </div>

                          {/* 信息 */}
                          <div className="p-2">
                            <h3 className="font-medium text-xs text-gray-900 truncate">
                              {dish.name}
                            </h3>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                              {dish.description || dish.nameEn || ''}
                            </p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-sm font-bold text-[#D4A853]">
                                ¥{typeof dish.price === 'number' ? dish.price.toFixed(0) : dish.price}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenDish(dish); }}
                                className="w-6 h-6 rounded-full bg-[#D4A853] text-white flex items-center justify-center"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center text-gray-400 text-sm">暂无菜品</div>
                )}
              </div>
            );
          })}
          {/* 底部留白 — 确保最后一个分类也能滚动到顶部 */}
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
