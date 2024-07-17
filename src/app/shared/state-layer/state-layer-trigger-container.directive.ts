import { Directive } from '@angular/core';

@Directive({
  selector: '[adxStateLayerTriggerContainer]',
  standalone: true,
  host: { class: 'state-layer-trigger-container' },
})
export class StateLayerTriggerContainerDirective {}
