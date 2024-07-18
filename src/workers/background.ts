'is:background';

import {
  combineLatestWith,
  distinctUntilKeyChanged,
  firstValueFrom,
  shareReplay,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { CaptureDom, CaptureDomCompleted } from '../shared/dom';
import { listen, send } from '../shared/messenger';
import { QueryWallpaper, QueryWallpaperResolved } from '../shared/wallpaper';
import { fetchWallpaperFromBing } from './core/bing-wallpaper';
import { upsertBookmark } from './core/bookmark-endpoints';
import { httpClient } from './core/http-client';

const wallpaper$ = timer(0, 1000 * 60 * 60 * 1).pipe(
  switchMap(() => fetchWallpaperFromBing()),
  distinctUntilKeyChanged('url'),
  tap((wallpaper) => httpClient.get(wallpaper.url)), // Preload wallpaper, but does it really work?
  shareReplay(1),
);
wallpaper$.subscribe();

listen(QueryWallpaper)
  .pipe(combineLatestWith(wallpaper$))
  .subscribe(([, wallpaper]) => {
    send(QueryWallpaperResolved, wallpaper);
  });

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (!bookmark.url) return;
  const [tab] = await chrome.tabs.query({ url: bookmark.url });
  if (!tab) return;
  setTimeout(() => send(CaptureDom, undefined, tab.id));
  const capture = await firstValueFrom(listen(CaptureDomCompleted));
  await upsertBookmark({
    url: bookmark.url,
    title: bookmark.title,
    document: capture.document,
    screenshot: capture.screenshot,
  });
});
