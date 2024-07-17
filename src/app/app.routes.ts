/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { provide } from '@angularity/core';
import { map, of } from 'rxjs';

import { BLANK_ROUTES } from './blank/blank.routes';
import { loadChildrenWithAsyncProviders } from './common/router.ext';
import { Wallpaper } from './core/wallpaper';
import { WallpaperService } from './core/wallpaper.service';

export const routes: Routes = [
  {
    path: '',
    loadChildren: (
      wallpaperService = inject(WallpaperService),
      isBrowser = isPlatformBrowser(inject(PLATFORM_ID)),
    ) =>
      loadChildrenWithAsyncProviders({
        providers: () =>
          isBrowser
            ? wallpaperService.fetch().pipe(
                map((wallpaper): Provider[] => [
                  provide({
                    token: Wallpaper,
                    useValue: wallpaper,
                  }),
                ]),
              )
            : of([]),
        children: [
          {
            path: 'blank',
            children: BLANK_ROUTES,
          },
        ],
      }),
  },
];
