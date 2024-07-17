import { inject, InjectionToken, Provider } from '@angular/core';
import { provide } from '@angularity/core';

export const ICONS = new InjectionToken<Icons>('ICONS');

export interface Icons {
  [name: string]: string;
}

export function provideIcons(icons: Icons): Provider[] {
  return [
    provide({
      token: ICONS,
      useFactory: (
        parent = inject(ICONS, { skipSelf: true, optional: true }),
      ) => ({
        ...parent,
        ...icons,
      }),
    }),
  ];
}
