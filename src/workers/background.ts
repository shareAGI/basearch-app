/* eslint-disable no-console */
'is:background';

import {
  combineLatestWith,
  distinctUntilChanged,
  firstValueFrom,
  shareReplay,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import {
  Bookmark,
  CapturedBookmark,
  QueryBookmarks,
  QueryBookmarksResolved,
} from '../shared/bookmark';
import { CaptureDom, CaptureDomCompleted } from '../shared/dom';
import { listen, send } from '../shared/messenger';
import { QueryWallpaper, QueryWallpaperResolved } from '../shared/wallpaper';
import { fetchWallpaperFromBing } from './core/bing-wallpaper';
import {
  createBookmarks,
  fetchBookmarks,
  searchBookmarks,
} from './core/bookmark-endpoints';
import { httpClient } from './core/http-client';

const wallpaper$ = timer(0, 1000 * 60 * 60 * 1).pipe(
  switchMap(() => fetchWallpaperFromBing()),
  distinctUntilChanged(),
  tap((wallpaper) => httpClient.get(wallpaper.srcUrl)), // Preload wallpaper, but does it really work?
  shareReplay(1),
);
wallpaper$.subscribe();

listen(QueryWallpaper)
  .pipe(combineLatestWith(wallpaper$))
  .subscribe(([, wallpaper]) => {
    send(QueryWallpaperResolved, wallpaper);
  });

listen(QueryBookmarks).subscribe(async (query) => {
  const bookmarks = await searchBookmarks(query);
  send(QueryBookmarksResolved, bookmarks);
});

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (!bookmark.url || !bookmark.dateAdded) return;
  const [tab] = await chrome.tabs.query({ url: bookmark.url });
  if (!tab) return;
  setTimeout(() => send(CaptureDom, undefined, tab.id));
  const capture = await firstValueFrom(listen(CaptureDomCompleted));
  const payload: CapturedBookmark = {
    url: bookmark.url,
    title: bookmark.title,
    document: capture.document,
    imageUrl: capture.screenshot,
    createdAt: new Date(bookmark.dateAdded),
  };
  console.log('Registering bookmark', payload);
  await createBookmarks([payload]);
});

timer(0, 1000 * 60 * 60 * 24).subscribe(() => {
  syncBookmarks();
});

async function syncBookmarks(): Promise<void> {
  const bookmarksRemote = await fetchBookmarks();
  const bookmarksLocal = await loadLocalBookmarks();
  const bookmarksToCreate = bookmarksLocal.filter(
    (local) => !bookmarksRemote.find((remote) => remote.url === local.url),
  );
  console.log('Syncing bookmarks', bookmarksToCreate);
  await createBookmarks(bookmarksToCreate);
}

async function loadLocalBookmarks(): Promise<Bookmark[]> {
  const tree = await chrome.bookmarks.getTree();
  return extractBookmarksFromTree(tree);
}

function extractBookmarksFromTree(
  tree: chrome.bookmarks.BookmarkTreeNode[],
): Bookmark[] {
  return tree.flatMap((node) => {
    if (node.url && node.dateAdded)
      return {
        url: node.url,
        title: node.title,
        createdAt: new Date(node.dateAdded),
      };
    else if (node.children) return extractBookmarksFromTree(node.children);
    throw new Error('Unexpected bookmark node');
  });
}
