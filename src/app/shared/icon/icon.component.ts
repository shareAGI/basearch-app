import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  InjectionToken,
  input,
  numberAttribute,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ICONS } from './icons';

export const ICON_FONT = new InjectionToken<string>('ICON_FONT_FAMILY');
export const ICON_FONT_READY = new InjectionToken<Promise<void>>(
  'ICON_FONT_LOADING',
);
export const ICON_SIZE = new InjectionToken<number>('ICON_SIZE', {
  factory: () => 24,
});

@Component({
  selector: 'adx-icon',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--icon-font]': 'font',
    '[style.--icon-size.px]': 'size()',
  },
})
export class IconComponent {
  font = inject(ICON_FONT);
  fontReady = inject(ICON_FONT_READY);
  private sizeDefault = inject(ICON_SIZE);
  private registry = inject(ICONS, { optional: true }) ?? {};
  private sanitizer = inject(DomSanitizer);

  icon = input.required<string>();
  size = input(this.sizeDefault, { transform: numberAttribute });

  content = computed(() => {
    const icon = this.icon();
    if (icon in this.registry) {
      const safe = this.sanitizer.bypassSecurityTrustHtml(this.registry[icon]);
      return { type: 'svg' as const, value: safe };
    }
    return { type: 'glyph' as const, value: icon };
  });
}
