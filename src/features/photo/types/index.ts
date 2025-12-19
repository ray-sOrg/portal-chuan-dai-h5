import type { EmotionTag } from '@prisma/client';

// 照片基本信息（列表用）
export interface PhotoListItem {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  url: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
  isFavorited: boolean;
  uploader: {
    id: string;
    nickname: string | null;
    avatar: string | null;
  };
}

// 照片详情
export interface PhotoDetail extends PhotoListItem {
  mediumUrl: string | null;
  emotionTag: EmotionTag | null;
  gathering: {
    id: string;
    title: string;
    date: Date;
    location: string | null;
  } | null;
  _count: {
    favorites: number;
    comments: number;
  };
}

// 评论
export interface PhotoCommentItem {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    nickname: string | null;
    avatar: string | null;
  };
}

// 聚会选项（上传时选择）
export interface GatheringOption {
  id: string;
  title: string;
  date: Date;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 分页结果
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
