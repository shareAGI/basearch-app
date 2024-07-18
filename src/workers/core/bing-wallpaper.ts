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
  const srcUrl = r.url;
  const data = await httpClient
    .get(srcUrl, { responseType: 'blob' })
    .then((r) => r.data);
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(data);
  });
  return { srcUrl, dataUrl };
}
