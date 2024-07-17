import { Directive, ElementRef, inject } from '@angular/core';

import { useBrowserOnly } from '../../common/platform-browser';

@Directive({
  selector: '[adxStateLayerTrigger]',
  standalone: true,
  host: { class: 'state-layer-trigger' },
})
export class StateLayerTriggerDirective {
  private browserOnly = useBrowserOnly();
  private element: HTMLElement = inject(ElementRef).nativeElement;
  constructor() {
    this.browserOnly(() => {
      const styles = window.getComputedStyle(this.element);
      if (styles.position === 'static')
        throw new Error(
          'StateLayerTriggerDirective requires a non-static position.',
        );
    });
  }
}
