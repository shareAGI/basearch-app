import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { listen, send } from '../../shared/messenger';
import {
  QueryWallpaper,
  QueryWallpaperResolved,
  Wallpaper,
} from '../../shared/wallpaper';

@Injectable({ providedIn: 'root' })
export class WallpaperLoader {
  private loaded?: Wallpaper;
  async load(): Promise<Wallpaper> {
    if (this.loaded) return this.loaded;
    setTimeout(() => send(QueryWallpaper));
    const wallpaper = await firstValueFrom(listen(QueryWallpaperResolved));
    this.loaded = wallpaper;
    return wallpaper;
  }
}
