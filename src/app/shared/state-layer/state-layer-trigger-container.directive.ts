import { Directive } from '@angular/core';

@Directive({
  selector: '[bsStateLayerTriggerContainer]',
  standalone: true,
  host: { class: 'state-layer-trigger-container' },
})
export class StateLayerTriggerContainerDirective {}
