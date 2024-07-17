import { ApplicationConfig, inject, Injectable } from '@angular/core';
import { provide } from '@angularity/core';
import {
  provideTheme,
  ThemeBuilderContext,
  ThemeTokens,
  TokensBuilder,
  withThemeBuilder,
} from '@angularity/theming';
import {
  SchemeBuilder,
  SchemeBuilderConfig,
  SchemeMode,
  SchemeVariant,
  TypescaleBuilder,
} from '@angularity/theming-material';
import {
  DynamicColor,
  hexFromArgb,
  MaterialDynamicColors,
} from '@material/material-color-utilities';

import { APP_THEME_TOKENS } from './app.theme.tokens';
import { APP_THEME_TYPESCALES } from './app.theme.typescales';
import { useBrowserOnly } from './common/platform-browser';
import { extractSeedColorsFromImageUrl } from './common/theming';
import { WallpaperLoader } from './core/wallpaper-loader.service';

@Injectable()
export class AppSchemeBuilder extends SchemeBuilder {
  override build(
    context: ThemeBuilderContext<SchemeBuilderConfig>,
  ): ThemeTokens {
    const scheme = this.getScheme(context.config);
    const tokens = super.build(context);
    const roles = MaterialDynamicColors;
    const use = (dynamicColor: DynamicColor): string =>
      hexFromArgb(dynamicColor.getArgb(scheme));
    tokens[`${context.name}-disabled`] = use(roles.onSurface) + '2e';
    tokens[`${context.name}-on-disabled`] = use(roles.onSurface) + '61';
    tokens[`${context.name}-success`] = '#006e25';
    tokens[`${context.name}-on-success`] = '#ffffff';
    tokens[`${context.name}-on-scrim`] = '#ffffff';
    return tokens;
  }
}

export const APP_THEME_CONFIG: ApplicationConfig = {
  providers: [
    provide({ token: SchemeBuilder, useClass: AppSchemeBuilder }),
    provideTheme(
      async (
        browserOnly = useBrowserOnly(),
        wallpaperLoader = inject(WallpaperLoader),
      ) => {
        const config = await browserOnly(async () => {
          const wallpaper = await wallpaperLoader.load();
          const [seedColor] = await extractSeedColorsFromImageUrl(
            wallpaper.url,
          );
          return {
            scheme: withThemeBuilder(SchemeBuilder, {
              primary: hexFromArgb(seedColor),
              mode: SchemeMode.Dark,
              variant: SchemeVariant.TONAL_SPOT,
            }),
            typescale: withThemeBuilder(TypescaleBuilder, APP_THEME_TYPESCALES),
            tokens: withThemeBuilder(TokensBuilder, APP_THEME_TOKENS),
          };
        });
        return config ?? {};
      },
    ),
  ],
};
