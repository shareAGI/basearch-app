import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[adxCaptureFocus]',
  standalone: true,
})
export class CaptureFocusDirective {
  private element: HTMLElement = inject(ElementRef).nativeElement;

  constructor() {
    afterNextRender(() => {
      this.element.focus();
    });
  }
}
