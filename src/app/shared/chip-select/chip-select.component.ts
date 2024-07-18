import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
} from '@angular/core';
import { provideComponentValueAccessor } from '@angularity/forms';

import { SimpleComponentValueAccessorHost } from '../../common/value-accessing.ext';
import { ChipButtonComponent } from '../chip/chip.component';
import { ChipGroupComponent } from '../chip-group/chip-group.component';

@Component({
  selector: 'bs-chip-select',
  standalone: true,
  imports: [CommonModule, ChipButtonComponent, ChipGroupComponent],
  templateUrl: './chip-select.component.html',
  styleUrls: ['./chip-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentValueAccessor(ChipSelectComponent)],
  host: { '(click)': 'touched$.emit()' },
})
export class ChipSelectComponent extends SimpleComponentValueAccessorHost<unknown> {
  scrollable = input(false, { transform: booleanAttribute });
  options = input.required<ChipSelectOption[]>();
  touched$ = new EventEmitter();
  onSelect(value: unknown): void {
    this.valueChange$.next(value);
  }
}

export interface ChipSelectOption {
  label: string;
  value: unknown;
  icon?: string;
}
