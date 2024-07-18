/// <reference types="@types/chrome" />

/* eslint-disable no-console */
import { mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provide } from '@angularity/core';
import { firstValueFrom } from 'rxjs';

import { AppComponent } from './app/app.component';
import { APP_CONFIG } from './app/app.config';
import { listen, send } from './shared/messenger';
import {
  QueryWallpaper,
  QueryWallpaperResolved,
  Wallpaper,
} from './shared/wallpaper';

class WallpaperLoader {
  private loaded?: Wallpaper = this.readLocalWallpaper();

  async load(): Promise<Wallpaper> {
    if (this.loaded) return this.loaded;
    setTimeout(() => send(QueryWallpaper));
    const wallpaper = await firstValueFrom(listen(QueryWallpaperResolved));
    this.loaded = wallpaper;
    this.saveLocalWallpaper(wallpaper);
    return wallpaper;
  }

  readLocalWallpaper(): Wallpaper | undefined {
    const raw = localStorage.getItem('wallpaper');
    if (!raw) return;
    return JSON.parse(raw);
  }

  saveLocalWallpaper(wallpaper: Wallpaper): void {
    localStorage.setItem('wallpaper', JSON.stringify(wallpaper));
  }
}

async function bootstrap() {
  const wallpaper = await new WallpaperLoader().load();
  bootstrapApplication(
    AppComponent,
    mergeApplicationConfig(APP_CONFIG, {
      providers: [provide({ token: Wallpaper, useValue: wallpaper })],
    }),
  );
}

bootstrap().catch((err) => console.error(err));

// This tells Angular CLI to bundle the worker.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mockRegisterWorkers() {
  new Worker(new URL('./workers/background', import.meta.url));
  new Worker(new URL('./workers/content', import.meta.url));
}
