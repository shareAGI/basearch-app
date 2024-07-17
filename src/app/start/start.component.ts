import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { match } from 'ts-pattern';

import { WallpaperLoader } from '../core/wallpaper-loader.service';
import { ChipSelectComponent } from '../shared/chip-select/chip-select.component';
import { IconComponent } from '../shared/icon/icon.component';
import { provideIcons } from '../shared/icon/icons';
import { IconButtonComponent } from '../shared/icon-button/icon-button.component';
import { iGitHub, iGoogle, iMicrosoft, iYouTube } from '../shared/icons';
import {
  SearchComponent,
  SearchTrailingSlot,
} from '../shared/search/search.component';
import { SearchControlComponent } from '../shared/search-control/search-control.component';
import { SwitchComponent } from '../shared/switch/switch.component';
import { SEARCH_ENGINES } from './search-engines';

type SearchSource = 'internet' | 'bookmarks';
type BookmarkSearchMode = 'locate' | 'review';

@Component({
  selector: 'adx-start',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconButtonComponent,
    [SearchComponent, SearchTrailingSlot, SearchControlComponent],
    IconComponent,
    ChipSelectComponent,
    SwitchComponent,
  ],
  providers: [provideIcons({ iGoogle, iMicrosoft, iGitHub, iYouTube })],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  host: { '[style.background-image]': 'backgroundImage()' },
})
export class StartComponent {
  private formBuilder = inject(FormBuilder).nonNullable;
  private wallpaperLoader = inject(WallpaperLoader);

  wallpaper = toSignal(from(this.wallpaperLoader.load()));
  backgroundImage = computed(() => {
    const url = this.wallpaper && this.wallpaper()?.url;
    return `url(${url})`;
  });

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
