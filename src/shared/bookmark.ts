import { $type } from '@angularity/core';

import { define } from './messenger';

export interface Bookmark {
  url: string;
  title: string;
  createdAt: Date;
}

export interface DetailedBookmark extends Bookmark {
  summary: string;
  imageUrl: string;
  imageRatio: number;
}

export interface CapturedBookmark extends Bookmark {
  document: string;
  imageUrl: string;
}

export function bookmarkIsDetailed(
  bookmark: Bookmark,
): bookmark is DetailedBookmark {
  return 'summary' in bookmark && 'imageUrl' in bookmark;
}

export function bookmarkIsCaptured(
  bookmark: Bookmark,
): bookmark is CapturedBookmark {
  return 'document' in bookmark && 'imageUrl' in bookmark;
}

export const QueryBookmarks = define('QueryBookmarks', $type<string>());
export const QueryBookmarksResolved = define(
  'QueryBookmarksResolved',
  $type<(Bookmark | CapturedBookmark)[]>(),
);
