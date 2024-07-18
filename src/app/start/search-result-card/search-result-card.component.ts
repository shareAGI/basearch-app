import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'button[adx-search-result-card]',
  standalone: true,
  imports: [],
  templateUrl: './search-result-card.component.html',
  styleUrl: './search-result-card.component.scss',
  host: {},
})
export class SearchResultCardComponent {
  headline = input.required<string>();
  url = input.required<string>();
  coverUrl = input<string>();
  coverRatio = input<number>();

  urlPrettified = computed(() => {
    const url = this.url();
    const urlObject = new URL(url);
    return urlObject.hostname + urlObject.pathname;
  });

  expanded = signal(false);
}
