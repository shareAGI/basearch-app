import { ApplicationConfig, computed, inject } from '@angular/core';
import { provide } from '@angularity/core';
import { firstValueFrom } from 'rxjs';

import { FontLoadObserver } from './common/font-load-observer.service';
import { ICON_FONT, ICON_FONT_READY } from './shared/icon/icon.component';
import { TOOLTIP_TRIGGER } from './shared/tooltip/tooltip.directive';

export const APP_COMPONENTS_CONFIG: ApplicationConfig = {
  providers: [
    provide({
      token: ICON_FONT,
      useValue: 'Material Symbols Outlined',
    }),
    provide({
      token: ICON_FONT_READY,
      useFactory: (observer = inject(FontLoadObserver)) =>
        firstValueFrom(
          observer.observe('Material Symbols Outlined', 15 * 1000),
        ),
    }),
    provide({
      token: TOOLTIP_TRIGGER,
      useFactory: () => computed(() => 'hover' as const),
    }),
  ],
};
