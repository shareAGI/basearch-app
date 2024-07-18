import { $type } from '@angularity/core';

import { define } from './messenger';

export interface Bookmark {
  url: string;
  title: string;
  createdAt: Date;
}

export interface DetailedBookmark extends Bookmark {
  summary: string;
  screenshot: string;
}

export interface CapturedBookmark extends DetailedBookmark {
  document: string;
}

export function bookmarkIsDetailed(
  bookmark: Bookmark,
): bookmark is DetailedBookmark {
  return 'summary' in bookmark && 'screenshot' in bookmark;
}

export function bookmarkIsCaptured(
  bookmark: Bookmark,
): bookmark is CapturedBookmark {
  return bookmarkIsDetailed(bookmark) && 'document' in bookmark;
}

export const QueryBookmarks = define('QueryBookmarks', $type<string>());
export const QueryBookmarksResolved = define(
  'QueryBookmarksResolved',
  $type<(Bookmark | CapturedBookmark)[]>(),
);
