import { Component, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../shared/icon/icon.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import {
  SearchComponent,
  SearchTrailingSlot,
} from '../../shared/search/search.component';
import { SearchControlComponent } from '../../shared/search-control/search-control.component';
import { SearchResultCardComponent } from '../search-result-card/search-result-card.component';

@Component({
  selector: 'adx-search-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    [SearchComponent, SearchTrailingSlot, SearchControlComponent],
    IconComponent,
    IconButtonComponent,
    SearchResultCardComponent,
  ],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss',
})
export class SearchPanelComponent {
  private formBuilder = inject(FormBuilder).nonNullable;

  keywordsInitial = input.required<string>({ alias: 'keywords' });
  keywordsControl = computed(() =>
    this.formBuilder.control(this.keywordsInitial()),
  );

  card = {
    headline: 'Headline',
    url: 'https://domain.com/asdfasdfasdf.html',
    cover: 'https://domain.com/asdfasdfasdf.jpg',
    summary: 'adsfasfasdasdf',
  };
  cards = [this.card, this.card, this.card, this.card, this.card, this.card];
}
