import { $type } from '@angularity/core';

import { define } from './messenger';

export abstract class Wallpaper {
  abstract srcUrl: string;
  abstract dataUrl: string;
}

export const QueryWallpaper = define('QueryWallpaper', $type<void>());
export const QueryWallpaperResolved = define(
  'QueryWallpaperResolved',
  $type<Wallpaper>(),
);
