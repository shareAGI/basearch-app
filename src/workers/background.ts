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

import { QueryBookmarks, QueryBookmarksResolved } from '../shared/bookmark';
import { CaptureDom, CaptureDomCompleted } from '../shared/dom';
import { listen, send } from '../shared/messenger';
import { QueryWallpaper, QueryWallpaperResolved } from '../shared/wallpaper';
import { fetchWallpaperFromBing } from './core/bing-wallpaper';
import { createBookmarks, searchBookmarks } from './core/bookmark-endpoints';
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
  await createBookmarks([
    {
      url: bookmark.url,
      title: bookmark.title,
      document: capture.document,
      imageUrl: capture.screenshot,
      createdAt: new Date(bookmark.dateAdded),
    },
  ]);
});
