import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideComponentValueAccessor } from '@angularity/forms';

import { SimpleComponentValueAccessorHost } from '../../common/value-accessing.ext';
import { IconComponent } from '../icon/icon.component';
import { StateLayerComponent } from '../state-layer/state-layer.component';
import { StateLayerTriggerDirective } from '../state-layer/state-layer-trigger.directive';

@Component({
  selector: 'bs-switch',
  standalone: true,
  imports: [StateLayerComponent, StateLayerTriggerDirective, IconComponent],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentValueAccessor(SwitchComponent)],
  host: {
    ['[class.selected]']: 'value()',
  },
})
export class SwitchComponent extends SimpleComponentValueAccessorHost<boolean> {
  icons = input(false, { transform: booleanAttribute });

  touched$ = new EventEmitter();

  value = toSignal(this.value$);

  onClick(): void {
    this.valueChange$.next(!this.value());
    this.touched$.emit();
  }
}
