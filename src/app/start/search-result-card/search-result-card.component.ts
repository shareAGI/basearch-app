import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'adx-search-result-card',
  standalone: true,
  imports: [],
  templateUrl: './search-result-card.component.html',
  styleUrl: './search-result-card.component.scss',
  host: {
    'class': 'group',
    '[class.expanded]': 'expanded()',
  },
})
export class SearchResultCardComponent {
  headline = input.required<string>();
  cover = input.required<string>();
  summary = input.required<string>();
  url = input.required<string>();
  urlPrettified = computed(() => {
    const url = this.url();
    const urlObject = new URL(url);
    return urlObject.hostname + urlObject.pathname;
  });

  expanded = signal(false);
}
