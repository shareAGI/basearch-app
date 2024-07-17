import { $type } from '@angularity/core';

import { define } from './messenger';

export abstract class Wallpaper {
  abstract url: string;
  abstract copyright: string;
  abstract copyrightUrl: string;
}

export const QueryWallpaper = define('QueryWallpaper', $type<void>());
export const QueryWallpaperResolved = define(
  'QueryWallpaperResolved',
  $type<Wallpaper>(),
);
