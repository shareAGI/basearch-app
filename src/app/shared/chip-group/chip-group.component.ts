import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'bs-chip-group',
  standalone: true,
  templateUrl: './chip-group.component.html',
  styleUrls: ['./chip-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.scrollable]': 'scrollable()' },
})
export class ChipGroupComponent {
  scrollable = input(false, { transform: booleanAttribute });
}
