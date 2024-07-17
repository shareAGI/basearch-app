import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComponentValueAccessorHost } from '@angularity/forms';
import {
  distinctUntilChanged,
  merge,
  shareReplay,
  startWith,
  Subject,
  Subscribable,
} from 'rxjs';

@Directive()
export abstract class SimpleComponentValueAccessorHost<T>
  implements ComponentValueAccessorHost<T>
{
  // prettier-ignore
  @Input('value') set valueInput(v: T) { this.valueInput$.next(v) }
  valueInput$ = new Subject<T>();

  @Output('valueChange')
  valueChange$ = new EventEmitter<T>();

  value$ = merge(this.valueInput$, this.valueChange$).pipe(
    startWith(null),
    distinctUntilChanged(),
    shareReplay(1),
  );

  abstract touched$: Subscribable<void>;

  constructor() {
    const changeDetector = inject(ChangeDetectorRef);
    this.value$.pipe(takeUntilDestroyed()).subscribe(() => {
      changeDetector.markForCheck();
    });
  }
}
