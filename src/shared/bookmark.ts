import { $type } from '@angularity/core';

import { define } from './messenger';

export interface Bookmark {
  url: string;
  title: string;
}

export interface CapturedBookmark extends Bookmark {
  document: string;
  screenshot: string;
}

export function bookmarkIsCaptured(
  bookmark: Bookmark,
): bookmark is CapturedBookmark {
  return 'document' in bookmark && 'screenshot' in bookmark;
}

export const QueryBookmarks = define('QueryBookmarks', $type<string>());
export const QueryBookmarksResolved = define(
  'QueryBookmarksResolved',
  $type<(Bookmark | CapturedBookmark)[]>(),
);
