import { ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  input,
  Signal,
  ViewContainerRef,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  race,
  Subject,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { match } from 'ts-pattern';

import { TooltipComponent } from './tooltip.component';

export const TOOLTIP_POSITIONS = new InjectionToken<ConnectedPosition[]>(
  'TOOLTIP_POSITIONS',
  {
    factory: () => [
      // above
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
      },
      // below
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      },
    ],
  },
);

export const TOOLTIP_TRIGGER = new InjectionToken<Signal<'hover' | 'hold'>>(
  'TOOLTIP_TRIGGER',
);

@Directive({
  selector: '[bsTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'mouseenter$.next()',
    '(mouseleave)': 'mouseleave$.next()',
    '(touchstart)': 'touchstart$.next()',
    '(touchend)': 'touchend$.next()',
  },
})
export class TooltipDirective {
  private overlay = inject(Overlay);
  private element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private destroyRef = inject(DestroyRef);
  private viewContainer = inject(ViewContainerRef);
  private trigger = inject(TOOLTIP_TRIGGER);
  private positions = inject(TOOLTIP_POSITIONS);
  private changeDetector = inject(ChangeDetectorRef);

  content = input.required<string>({ alias: 'bsTooltip' });

  mouseenter$ = new Subject();
  mouseleave$ = new Subject();
  touchstart$ = new Subject();
  touchend$ = new Subject();

  private overlayRef = this.overlay.create({
    positionStrategy: this.overlay
      .position()
      .flexibleConnectedTo(this.element)
      .withPositions(this.positions),
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.overlayRef.dispose());
    toObservable(this.trigger)
      .pipe(
        switchMap((trigger) =>
          match(trigger)
            .with('hover', () => this.getCoordinatorForHover())
            .with('hold', () => this.getCoordinatorForHold())
            .exhaustive(),
        ),
      )
      .pipe(distinctUntilChanged())
      .subscribe((show) => {
        if (show) this.show();
        else this.hide();
      });
  }

  show(): void {
    if (this.overlayRef.hasAttached()) return;
    const portal = new ComponentPortal(TooltipContainer, this.viewContainer);
    this.overlayRef.attach(portal);
  }

  hide(): void {
    if (!this.overlayRef.hasAttached()) return;
    this.overlayRef.detach();
  }

  private getCoordinatorForHover(): Observable<boolean> {
    return merge(
      this.mouseenter$.pipe(map(() => true)),
      this.mouseleave$.pipe(map(() => false)),
    );
  }

  private getCoordinatorForHold(): Observable<boolean> {
    return merge(
      this.touchend$.pipe(map(() => false)),
      this.touchstart$.pipe(
        switchMap(() =>
          race(
            timer(500).pipe(
              map(() => true),
              tap(() => this.changeDetector.markForCheck()),
            ),
            this.touchend$.pipe(map(() => false)),
          ).pipe(take(1), filter(Boolean)),
        ),
      ),
    );
  }
}
@Component({
  selector: 'bs-tooltip-container',
  standalone: true,
  imports: [TooltipComponent],
  template: ` <bs-tooltip>{{ content() }}</bs-tooltip> `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class TooltipContainer {
  content = inject(TooltipDirective).content;
}
