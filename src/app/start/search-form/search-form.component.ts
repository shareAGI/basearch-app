import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { match } from 'ts-pattern';

import { ChipSelectComponent } from '../../shared/chip-select/chip-select.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import {
  SearchComponent,
  SearchTrailingSlot,
} from '../../shared/search/search.component';
import { SearchControlComponent } from '../../shared/search-control/search-control.component';
import { SwitchComponent } from '../../shared/switch/switch.component';
import { SEARCH_ENGINES } from '../search-engines';

type SearchSource = 'internet' | 'bookmarks';
type BookmarkSearchMode = 'locate' | 'review';

@Component({
  selector: 'adx-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconButtonComponent,
    [SearchComponent, SearchTrailingSlot, SearchControlComponent],
    IconComponent,
    ChipSelectComponent,
    SwitchComponent,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  private formBuilder = inject(FormBuilder).nonNullable;

  searchSourceSwitchValue = signal(false);
  searchSource = computed<SearchSource>(() =>
    this.searchSourceSwitchValue() ? 'bookmarks' : 'internet',
  );

  internetSearchEngineOptions = SEARCH_ENGINES.map((e) => ({
    label: e.name,
    value: e,
    icon: e.icon,
  }));

  bookmarkSearchModeOptions = [
    {
      label: 'To locate items',
      value: 'locate' satisfies BookmarkSearchMode,
      icon: 'search',
    },
    {
      label: 'To review content',
      value: 'review' satisfies BookmarkSearchMode,
      icon: 'book_5',
    },
  ];

  form = this.formBuilder.group({
    keywords: '',
    engine: this.internetSearchEngineOptions[0].value,
    mode: 'locate' as BookmarkSearchMode,
  });

  onSubmit(): void {
    const source = this.searchSource();
    match(source)
      .with('internet', () => this.onInternetSearchSubmit())
      .with('bookmarks', () => this.onBookmarkSearchSubmit())
      .exhaustive();
  }

  onInternetSearchSubmit(): void {
    const { keywords, engine } = this.form.value;
    if (!keywords || !engine) throw new Error('Invalid form state');
    const { scheme } = engine;
    const url = scheme.replace('@', encodeURIComponent(keywords));
    window.open(url, '_self');
  }

  onBookmarkSearchSubmit(): void {
    const { keywords } = this.form.value;
    if (!keywords) throw new Error('Invalid form state');
  }
}
