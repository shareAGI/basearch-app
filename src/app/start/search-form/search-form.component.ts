import {
  animate,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { match } from 'ts-pattern';

import { duration, easing } from '../../core/animations';
import { CaptureFocusDirective } from '../../shared/capture-focus.directive';
import { ChipSelectComponent } from '../../shared/chip-select/chip-select.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { RerenderDirective } from '../../shared/rerender.directive';
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
    RerenderDirective,
    CaptureFocusDirective,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  host: { '[@SearchForm]': '' },
  animations: [
    trigger('SearchForm', [
      transition(':enter', [
        group([
          query('@SearchControl', [
            style({ width: '56px' }),
            animate(
              `${duration('medium2')} ${easing('emphasized-decelerate')}`,
            ),
          ]),
          query(
            '@SearchControl > *, @SearchChips [adx-chip], .switch-actions > *',
            [style({ opacity: 0, transform: 'translateX(-8px)' })],
          ),
          query(
            '@SearchControl > *, @SearchChips [adx-chip], .switch-actions > *',
            [
              stagger(50, [
                animate(
                  `${duration('medium1')} ${easing('emphasized-decelerate')}`,
                ),
              ]),
            ],
            { delay: duration('medium2') },
          ),
        ]),
      ]),
    ]),
    trigger('SearchControl', [
      transition(':enter', [
        query(':scope > *', [
          style({ opacity: 0, transform: 'translateX(-8px)' }),
          stagger(50, [
            animate(
              `${duration('medium1')} ${easing('emphasized-decelerate')}`,
            ),
          ]),
        ]),
      ]),
    ]),
    trigger('SearchChips', [
      transition(':enter', [
        query('[adx-chip]', [
          style({ opacity: 0, transform: 'translateX(-8px)' }),
          stagger(50, [
            animate(
              `${duration('medium1')} ${easing('emphasized-decelerate')}`,
            ),
          ]),
        ]),
      ]),
    ]),
    trigger('SearchSwitchInstruction', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-8px)' }),
        animate(`${duration('medium1')} ${easing('emphasized-decelerate')}`),
      ]),
    ]),
  ],
})
export class SearchFormComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder).nonNullable;

  searchSourceSwitchValue = signal(this.readLocalSearchSourceSwitchValue());
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

  constructor() {
    effect(() => {
      this.saveLocalSearchSourceSwitchValue(this.searchSourceSwitchValue());
    });
  }

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
    this.router.navigate(['/start/search', { query: keywords }]);
  }

  private readLocalSearchSourceSwitchValue(): boolean {
    const raw = localStorage.getItem('searchSourceSwitchValue');
    if (!raw) return false;
    return JSON.parse(raw);
  }

  private saveLocalSearchSourceSwitchValue(value: boolean): void {
    localStorage.setItem('searchSourceSwitchValue', JSON.stringify(value));
  }
}
