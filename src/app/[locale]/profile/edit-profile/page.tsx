'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ChevronLeft, User, Calendar, Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Locale } from 'next-intl';

export default function EditProfilePage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    nickname: '',
    bio: '',
    gender: '',
    birthday: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      // TODO: 调用更新用户信息 API
      toast.success('保存成功');
      router.back();
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-muted rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{t('editProfile')}</h1>
        </div>
      </header>

      <main className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 头像 */}
          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
            >
              {t('avatar')} 
            </button>
          </div>

          {/* 昵称 */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              {t('nickname')}
            </label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder={t('nicknamePlaceholder')}
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 个人简介 */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              {t('bio')}
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder={t('bioPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* 性别 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('gender')}</label>
            <div className="flex gap-3">
              {['MALE', 'FEMALE', 'OTHER'].map((gender) => (
                <label
                  key={gender}
                  className={`flex-1 py-3 rounded-lg border text-center cursor-pointer transition-colors ${
                    form.gender === gender
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={form.gender === gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="sr-only"
                  />
                  {gender === 'MALE' ? t('male') : gender === 'FEMALE' ? t('female') : t('other')}
                </label>
              ))}
            </div>
          </div>

          {/* 生日 */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('birthday')}
            </label>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 保存按钮 */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isPending ? t('submitting') || '保存中...' : t('saveProfile')}
          </button>
        </form>
      </main>
    </div>
  );
}
