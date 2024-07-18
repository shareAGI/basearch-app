import { ChangeDetectionStrategy, Component } from '@angular/core';

import { StateLayerComponent } from '../state-layer/state-layer.component';
import { StateLayerTriggerDirective } from '../state-layer/state-layer-trigger.directive';

@Component({
  selector: 'button[adx-icon-button]',
  standalone: true,
  imports: [StateLayerComponent],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [StateLayerTriggerDirective],
  host: { type: 'button' },
})
export class IconButtonComponent {}
