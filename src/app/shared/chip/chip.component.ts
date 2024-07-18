import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { duration, easing } from '../../core/animations';
import { IconComponent } from '../icon/icon.component';
import { RerenderDirective } from '../rerender.directive';
import { StateLayerComponent } from '../state-layer/state-layer.component';
import { StateLayerTriggerDirective } from '../state-layer/state-layer-trigger.directive';

const imports = [IconComponent, StateLayerComponent, RerenderDirective];
const animations = [
  trigger('Chip', [
    transition(':enter, :leave', []),
    transition('* => *', [
      group([
        query(
          'bs-icon:enter',
          [
            style({ opacity: 0, width: 0 }),
            animate(`${duration('short2')} ${easing('standard')}`),
          ],
          { optional: true },
        ),
        query(
          'bs-icon:leave',
          [
            animate(`${duration('short2')} ${easing('standard')}`),
            style({ opacity: 0, width: 0 }),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ]),
];

@Component({
  selector: 'bs-chip',
  standalone: true,
  imports,
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[@Chip]': 'selected' },
  animations,
})
export class ChipComponent {
  @Input() icon?: string;
  @Input() @HostBinding('class.selected') selected?: boolean;
}

@Component({
  selector: 'button[bs-chip]',
  standalone: true,
  imports,
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'type': 'button', '[@Chip]': 'selected' },
  hostDirectives: [StateLayerTriggerDirective],
  animations,
})
export class ChipButtonComponent extends ChipComponent {}
