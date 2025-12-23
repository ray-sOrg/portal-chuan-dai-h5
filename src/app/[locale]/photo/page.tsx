import { getTranslations } from 'next-intl/server';
import { getPhotos } from '@/features/photo/actions';
import { getAuth } from '@/features/auth/queries/get-auth';
import { PhotoGrid } from '@/features/photo/components';
import { ThemeToggle } from '@/components/theme';
import { LanguageToggle } from '@/components/language-toggle';
import { UploadButton } from './upload-button';

// 页面缓存 30 秒
export const revalidate = 30;

export default async function PhotoPage() {
  const t = await getTranslations();

  // 获取初始照片列表和登录状态
  const [{ items: photos, hasMore }, { user }] = await Promise.all([
    getPhotos({ page: 1, pageSize: 20 }),
    getAuth(),
  ]);

  return (
    <>
      {/* Header */}
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t('photoWall.title')}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-24">
        <div className="container mx-auto">
          <PhotoGrid initialPhotos={photos} hasMore={hasMore} />
        </div>
      </div>

      {/* 底部固定上传按钮 */}
      <UploadButton isLoggedIn={!!user} />
    </>
  );
}
