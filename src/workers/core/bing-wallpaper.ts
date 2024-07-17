import { Wallpaper } from '../../shared/wallpaper';
import { httpClient } from './http-client';

export interface BingWallpaperResponse {
  ['url']: string;
  ['copyright']: string;
  ['copyright_link']: string;
}

export async function fetchWallpaperFromBing(): Promise<Wallpaper> {
  const r: BingWallpaperResponse = await httpClient
    .get('https://bing.biturl.top/')
    .then((r) => r.data);
  return {
    url: r.url,
    copyright: r.copyright,
    copyrightUrl: r.copyright_link,
  };
}
