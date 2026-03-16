'use client';

import { Camera } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRequireAuth } from '@/hooks/use-require-auth';

interface UploadButtonProps {
    isLoggedIn: boolean;
}

export function UploadButton({ isLoggedIn }: UploadButtonProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { navigateWithAuth } = useRequireAuth({ isLoggedIn });

    const handleClick = () => {
        navigateWithAuth(`/${locale}/photo/upload`);
    };

    return (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
            <div className="container mx-auto">
                <button
                    onClick={handleClick}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Camera className="w-5 h-5" />
                    <span>{t('photoWall.upload')}</span>
                </button>
            </div>
        </div>
    );
}
