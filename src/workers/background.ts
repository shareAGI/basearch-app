'is:background';

import axios from 'axios';
import {
  distinctUntilKeyChanged,
  shareReplay,
  switchMap,
  timer,
  withLatestFrom,
} from 'rxjs';

import { listen, send } from '../shared/messenger';
import {
  QueryWallpaper,
  QueryWallpaperResolved,
  Wallpaper,
} from '../shared/wallpaper';

interface BingWallpaperResponse {
  ['url']: string;
  ['copyright']: string;
  ['copyright_link']: string;
}

async function fetchWallpaperFromBing(): Promise<Wallpaper> {
  const r: BingWallpaperResponse = await axios
    .get('https://bing.biturl.top/')
    .then((r) => r.data);
  return {
    url: r.url,
    copyright: r.copyright,
    copyrightUrl: r.copyright_link,
  };
}

const wallpaper$ = timer(0, 1000 * 60 * 60 * 1).pipe(
  switchMap(() => fetchWallpaperFromBing()),
  distinctUntilKeyChanged('url'),
  shareReplay(1),
);
wallpaper$.subscribe();

listen(QueryWallpaper)
  .pipe(withLatestFrom(wallpaper$))
  .subscribe(([, wallpaper]) => {
    send(QueryWallpaperResolved, wallpaper);
  });
