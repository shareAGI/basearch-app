import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { duration, easing } from '../../core/animations';

@Component({
  selector: 'adx-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ['[@Tooltip]']: '' },
  animations: [
    trigger('Tooltip', [
      transition(':enter', [
        group([
          // Cannot animate width/height here, otherwise the overlay cannot
          // determine the appropriate position.
          query(':self', [
            style({ transform: 'scale(80%)' }),
            animate(`${duration('short2')} ${easing('standard')}`),
          ]),
          query('.content', [
            style({ opacity: 0 }),
            animate(`${duration('short2')} ${easing('standard')}`),
          ]),
        ]),
      ]),
      // TODO: :leave animation
    ]),
  ],
})
export class TooltipComponent {}
