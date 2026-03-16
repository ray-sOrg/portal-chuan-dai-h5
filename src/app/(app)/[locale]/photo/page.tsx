import { getTranslations } from 'next-intl/server';
import { getPhotos } from '@/features/photo/actions';
import { getAuth } from '@/features/auth/queries/get-auth';
import { PhotoGrid } from '@/features/photo/components';
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
      {/* Main Content */}
      <div className="p-4">
        <div className="container mx-auto">
          <PhotoGrid initialPhotos={photos} hasMore={hasMore} />
        </div>
      </div>

      {/* 底部固定上传按钮 */}
      <UploadButton isLoggedIn={!!user} />
    </>
  );
}
