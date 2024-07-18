import { Directive, ElementRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

import { ResizeObserver } from '../common/resize-observer.service';

@Directive({
  selector: '[bsBoundingBox]',
  exportAs: 'bsBoundingBox',
  standalone: true,
})
export class BoundingBoxDirective {
  private observer = inject(ResizeObserver);
  private element: HTMLElement = inject(ElementRef).nativeElement;
  private resize$ = this.observer.observe(this.element);
  boundingBox$ = this.resize$.pipe(
    startWith(null),
    map(() => this.element.getBoundingClientRect()),
  );
  boundingBox = toSignal(this.boundingBox$, { requireSync: true });
}
