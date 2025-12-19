import { getTranslations } from 'next-intl/server';
import { getPhotos } from '@/features/photo/actions';
import { getAuth } from '@/features/auth/queries/get-auth';
import { PhotoGrid } from '@/features/photo/components';
import { UploadButton } from './upload-button';

export default async function PhotoPage() {
  const t = await getTranslations();

  // 获取初始照片列表和登录状态
  const [{ items: photos, hasMore }, { user }] = await Promise.all([
    getPhotos({ page: 1, pageSize: 20 }),
    getAuth(),
  ]);

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">{t('photoWall.title')}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <div className="container mx-auto">
          <PhotoGrid initialPhotos={photos} hasMore={hasMore} />
        </div>
      </main>

      {/* 底部固定上传按钮 */}
      <UploadButton isLoggedIn={!!user} />
    </div>
  );
}
