import { Suspense } from "react";
import { useTranslations } from 'next-intl';
import { Share } from 'lucide-react';
import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";

// 模拟照片数据
const cuisinePhotos = [
  { id: '1', title: 'Spicy Dan-Dan Noodles', titleZh: '麻辣担担面', category: 'cuisine' },
  { id: '2', title: 'Yunnan Rice Terraces', titleZh: '云南梯田', category: 'culture' },
  { id: '3', title: 'Traditional Hotpot Feast', titleZh: '传统火锅盛宴', category: 'cuisine' },
  { id: '4', title: 'Ancient Yunnan Street', titleZh: '云南古街', category: 'culture' },
  { id: '5', title: 'Mapo Tofu Perfection', titleZh: '完美麻婆豆腐', category: 'cuisine' },
  { id: '6', title: 'Sichuan Bamboo Forest', titleZh: '四川竹林', category: 'culture' }
];

const collections = [
  { id: 'street-food', title: 'Street Food Delights', titleZh: '街头美食', count: 12 },
  { id: 'landscapes', title: 'Mountain Landscapes', titleZh: '山地风景', count: 8 }
];

export default function PhotoPage() {
  const t = useTranslations();
  
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t('photoWall.title')}</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        <div className="container mx-auto space-y-8">
          {/* Explore Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t('photoWall.exploreCuisine')}</h2>
            <Suspense fallback={<Spinner />}>
              <div className="grid grid-cols-2 gap-3">
                {cuisinePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square bg-muted rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      📸
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-medium text-sm">
                          {photo.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${
                        photo.category === 'cuisine' 
                          ? 'bg-primary/80' 
                          : 'bg-success/80'
                      }`}>
                        {photo.category === 'cuisine' ? '美食' : '文化'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </section>

          {/* Themed Collections */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t('photoWall.themedCollections')}</h2>
            <div className="grid gap-4">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    📸 Collection
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {collection.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded-full">
                          {collection.count} {t('photoWall.photos')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
