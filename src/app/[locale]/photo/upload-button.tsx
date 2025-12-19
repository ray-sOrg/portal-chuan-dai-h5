'use client';

import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface UploadButtonProps {
    isLoggedIn: boolean;
}

export function UploadButton({ isLoggedIn }: UploadButtonProps) {
    const t = useTranslations();
    const router = useRouter();

    const handleClick = () => {
        // 使用相对路径，保持当前 locale
        if (isLoggedIn) {
            router.push('./upload');
        } else {
            router.push('../sign-in');
        }
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
