/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { provide } from '@angularity/core';
import { of } from 'rxjs';

import { Wallpaper } from '../shared/wallpaper';
import { useBrowserOnly } from './common/platform-browser';
import { loadChildrenWithAsyncProviders } from './common/router.ext';
import { WallpaperLoader } from './core/wallpaper-loader.service';
import { START_ROUTES } from './start/start.routes';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      loadChildrenWithAsyncProviders({
        providers: (
          browserOnly = useBrowserOnly(),
          wallpaperLoader = inject(WallpaperLoader),
        ) => {
          const providers = browserOnly(async () => {
            const wallpaper = await wallpaperLoader.load();
            return [provide({ token: Wallpaper, useValue: wallpaper })];
          });
          return providers ?? of([]);
        },
        children: [
          {
            path: 'start',
            children: START_ROUTES,
          },
        ],
      }),
  },
];
