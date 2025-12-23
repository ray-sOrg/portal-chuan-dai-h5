import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuth } from '@/features/auth/queries/get-auth';
import { UploadForm } from './upload-form';

export default async function PhotoUploadPage() {
    const t = await getTranslations();

    // 检查登录状态
    const { user } = await getAuth();
    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold">{t('photoWall.upload')}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 pb-20">
                <div className="container mx-auto max-w-lg">
                    <UploadForm />
                </div>
            </main>
        </div>
    );
}
