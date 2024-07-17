import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[adxStateLayerTrigger]',
  standalone: true,
  host: { class: 'state-layer-trigger' },
})
export class StateLayerTriggerDirective {
  private element: HTMLElement = inject(ElementRef).nativeElement;
  constructor() {
    const styles = window.getComputedStyle(this.element);
    if (styles.position === 'static')
      throw new Error(
        'StateLayerTriggerDirective requires a non-static position.',
      );
  }
}
