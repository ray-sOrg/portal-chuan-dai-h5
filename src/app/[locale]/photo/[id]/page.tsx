import { notFound } from 'next/navigation';
import { getPhotoDetail } from '@/features/photo/actions';
import { getAuth } from '@/features/auth/queries/get-auth';
import { PhotoDetailView } from './photo-detail-view';
import { CommentSection } from './comment-section';

interface PhotoDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function PhotoDetailPage({ params }: PhotoDetailPageProps) {
    const { id } = await params;

    const [photo, { user }] = await Promise.all([
        getPhotoDetail(id),
        getAuth(),
    ]);

    if (!photo) {
        notFound();
    }

    return (
        <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold line-clamp-1">{photo.title}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-20">
                <PhotoDetailView photo={photo} isLoggedIn={!!user} />
                <CommentSection photoId={photo.id} isLoggedIn={!!user} />
            </main>
        </div>
    );
}
