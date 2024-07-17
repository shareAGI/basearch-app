import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  mergeApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';

import { APP_COMPONENTS_CONFIG } from './app.components.config';
import { routes } from './app.routes';
import { APP_THEME_CONFIG } from './app.theme.config';
import { enableRoutesLoaderInjectionContext } from './common/router.ext';

const config: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(),
    provideRouter(
      enableRoutesLoaderInjectionContext(routes),
      withComponentInputBinding(),
      withHashLocation(),
    ),
    provideHttpClient(withFetch()),
  ],
};

export const APP_CONFIG: ApplicationConfig = mergeApplicationConfig(
  config,
  APP_THEME_CONFIG,
  APP_COMPONENTS_CONFIG,
);
