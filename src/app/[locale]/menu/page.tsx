import { Suspense } from "react";
import { useTranslations } from 'next-intl';
import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";

// 模拟菜品数据
const mockDishes = [
  {
    id: '1',
    name: 'Kung Pao Chicken',
    nameZh: '宫保鸡丁',
    description: 'A classic Sichuan dish with diced chicken, peanuts, vegetables, and chili peppers. Sweet.',
    descriptionZh: '经典川菜，鸡丁配花生、蔬菜和辣椒。香甜可口。',
    price: 18.50,
    category: 'main',
    tags: ['spicy', 'chicken'],
    image: '/dishes/kung-pao-chicken.jpg'
  },
  {
    id: '2',
    name: 'Mapo Tofu',
    nameZh: '麻婆豆腐',
    description: 'A popular Sichuan dish with silken tofu set in a spicy chili- and bean-based sauce, with minced',
    descriptionZh: '经典川菜，嫩滑豆腐配麻辣酱汁',
    price: 16.00,
    category: 'main',
    tags: ['spicy', 'vegetarian'],
    image: '/dishes/mapo-tofu.jpg'
  }
];

const categories = [
  { id: 'all', labelKey: 'menu.categories.all' },
  { id: 'appetizers', labelKey: 'menu.categories.appetizers' },
  { id: 'mainCourses', labelKey: 'menu.categories.mainCourses' },
  { id: 'soups', labelKey: 'menu.categories.soups' }
];

export default function MenuPage() {
  const t = useTranslations();
  
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t('common.menu')}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        <div className="container mx-auto space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category.id === 'mainCourses'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {t(category.labelKey)}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <Suspense fallback={<Spinner />}>
            <div className="grid gap-4">
              {mockDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-card rounded-lg overflow-hidden border border-border shadow-sm"
                >
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      📸 {dish.name}
                    </div>
                    {/* 收藏按钮 */}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center">
                      ♡
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{dish.name}</h3>
                      <span className="text-lg font-bold text-primary">${dish.price}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-2 mb-3">
                      {dish.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs rounded-full ${
                            tag === 'spicy'
                              ? 'bg-destructive/10 text-destructive'
                              : tag === 'chicken'
                              ? 'bg-secondary/10 text-secondary'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          {t(`menu.tags.${tag}`)}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {dish.description}
                    </p>
                    
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      + {t('menu.add')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
