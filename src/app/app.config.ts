import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provide } from '@angularity/core';

import { routes } from './app.routes';
import { enableRoutesLoaderInjectionContext } from './common/router.ext';
import {
  BingWallpaperService,
  WallpaperService,
} from './core/wallpaper.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(),
    provideRouter(enableRoutesLoaderInjectionContext(routes)),
    provideHttpClient(withFetch()),
    provide({
      token: WallpaperService,
      useExisting: BingWallpaperService,
    }),
  ],
};
