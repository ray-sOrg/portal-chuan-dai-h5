import { Suspense } from "react";
import { useTranslations } from 'next-intl';
import { 
  User, 
  Heart, 
  Clock, 
  Settings, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";

// 模拟用户数据
const mockUser = {
  name: 'Li Mei',
  email: 'limei.customer@example.com',
  avatar: null
};

// 模拟收藏和订单数据
const mockFavorites = [
  {
    id: '1',
    name: 'Sichuan Spicy Noodles',
    nameZh: '川味辣面条',
    description: 'Hand-pulled noodles with fiery chili oil',
    descriptionZh: '手工拉面配火辣辣椒油',
    price: 12.50
  },
  {
    id: '2',
    name: 'Pork & Chive Dumplings',
    nameZh: '猪肉韭菜饺子',
    description: 'Pan-fried with a ginger soy dip',
    descriptionZh: '煎饺配姜汁蘸料',
    price: 8.00
  }
];

const mockOrders = [
  {
    id: '52720',
    date: 'October 18, 2023',
    items: 'Sichuan Mapo Tofu, Steamed Rice',
    total: 24.99,
    status: 'delivered'
  },
  {
    id: '45056',
    date: 'September 29, 2023',
    items: 'Kung Pao Chicken, Egg Fried Rice, Spring Rolls',
    total: 38.50,
    status: 'delivered'
  }
];

export default function ProfilePage() {
  const t = useTranslations();
  
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t('common.profile')}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        <div className="container mx-auto space-y-6">
          {/* User Profile Section */}
          <section className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{mockUser.name}</h2>
                <p className="text-muted-foreground">{mockUser.email}</p>
              </div>
            </div>
            <button className="w-full border border-border rounded-lg py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
              {t('profile.editProfile')}
            </button>
          </section>

          {/* My Favorites */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {t('profile.myFavorites')}
            </h3>
            <Suspense fallback={<Spinner />}>
              <div className="space-y-3">
                {mockFavorites.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-lg p-4 border border-border flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      📸
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
                      {t('profile.addToBag')}
                    </button>
                  </div>
                ))}
              </div>
            </Suspense>
          </section>

          {/* Order History */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t('profile.orderHistory')}
            </h3>
            <div className="space-y-3">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-lg p-4 border border-border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order ID: {order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{order.items}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 border border-border rounded-lg py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                      {t('profile.viewReceipt')}
                    </button>
                    <button className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                      {t('profile.reorder')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* App Settings */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              {t('profile.appSettings')}
            </h3>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {[
                { icon: Settings, labelKey: 'profile.generalSettings' },
                { icon: Bell, labelKey: 'profile.notifications' },
                { icon: Shield, labelKey: 'profile.privacyPolicy' },
                { icon: LogOut, labelKey: 'profile.logOut', danger: true }
              ].map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                    index !== 3 ? 'border-b border-border' : ''
                  } ${item.danger ? 'text-destructive' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
