import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Wallpaper } from './wallpaper';

export abstract class WallpaperService {
  abstract fetch(): Observable<Wallpaper>;
}

export interface BingWallpaperEndpointResponse {
  ['url']: string;
  ['copyright']: string;
  ['copyright_link']: string;
}

@Injectable({ providedIn: 'root' })
export class BingWallpaperService implements WallpaperService {
  private endpoint = 'https://bing.biturl.top/';
  private client = inject(HttpClient);

  fetch(): Observable<Wallpaper> {
    return this.client.get(this.endpoint).pipe(
      map((r) => r as BingWallpaperEndpointResponse),
      map(
        (r): Wallpaper => ({
          url: r.url,
          copyright: r.copyright,
          copyrightUrl: r.copyright_link,
        }),
      ),
    );
  }
}
