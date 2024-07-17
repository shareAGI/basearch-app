'is:background';

import {
  combineLatestWith,
  distinctUntilKeyChanged,
  shareReplay,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { listen, send } from '../shared/messenger';
import { QueryWallpaper, QueryWallpaperResolved } from '../shared/wallpaper';
import { fetchWallpaperFromBing } from './core/bing-wallpaper';
import { httpClient } from './core/http-client';

const wallpaper$ = timer(0, 1000 * 60 * 60 * 1).pipe(
  switchMap(() => fetchWallpaperFromBing()),
  distinctUntilKeyChanged('url'),
  tap((wallpaper) => httpClient.get(wallpaper.url)), // Preload wallpaper, but does it really work?
  shareReplay(1),
);

listen(QueryWallpaper)
  .pipe(combineLatestWith(wallpaper$))
  .subscribe(([, wallpaper]) => {
    send(QueryWallpaperResolved, wallpaper);
  });
