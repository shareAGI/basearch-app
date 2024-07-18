import { Component, input, signal } from '@angular/core';

import { ShortUrlPipe } from '../../shared/short-url.pipe';

@Component({
  selector: 'button[adx-search-result-card]',
  standalone: true,
  imports: [ShortUrlPipe],
  templateUrl: './search-result-card.component.html',
  styleUrl: './search-result-card.component.scss',
  host: {},
})
export class SearchResultCardComponent {
  headline = input.required<string>();
  url = input.required<string>();
  coverUrl = input<string>();
  coverRatio = input<number>();
  futureSelection = input<boolean>();
  expanded = signal(false);
}
