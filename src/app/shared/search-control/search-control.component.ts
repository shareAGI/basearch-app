import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '[adx-search-control]',
  standalone: true,
  imports: [],
  templateUrl: './search-control.component.html',
  styleUrl: './search-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchControlComponent {}
