import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxMasonryModule } from 'ngx-masonry';
import { startWith, switchMap } from 'rxjs';

import { duration, easing } from '../../core/animations';
import { BookmarkService } from '../../core/bookmark.service';
import { BoundingBoxDirective } from '../../shared/bounding-box.directive';
import { CaptureFocusDirective } from '../../shared/capture-focus.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';
import { MasonryAutoResizeDirective } from '../../shared/masonry-auto-resize.directive';
import {
  SearchComponent,
  SearchTrailingSlot,
} from '../../shared/search/search.component';
import { SearchControlComponent } from '../../shared/search-control/search-control.component';
import { SearchResultCardComponent } from '../search-result-card/search-result-card.component';

const SEARCH_RESULT_CARD_ANIMATIONS = {
  show: [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate(
      `${duration('medium1')} ${easing('emphasized-decelerate')}`,
      style({ opacity: 1, transform: 'scale(1)' }),
    ),
  ],
};

@Component({
  selector: 'adx-search-panel',
  standalone: true,
  imports: [
    [NgxMasonryModule, MasonryAutoResizeDirective],
    ReactiveFormsModule,
    RouterLink,
    [SearchComponent, SearchTrailingSlot, SearchControlComponent],
    IconComponent,
    IconButtonComponent,
    SearchResultCardComponent,
    LoadingOverlayComponent,
    CaptureFocusDirective,
    BoundingBoxDirective,
  ],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss',
  animations: [
    trigger('SearchResults', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          `${duration('long2')} 500ms ${easing('emphasized-decelerate')}`,
        ),
      ]),
    ]),
  ],
})
export class SearchPanelComponent {
  private formBuilder = inject(FormBuilder).nonNullable;
  private bookmarksService = inject(BookmarkService);

  queryInitial = input.required<string>({ alias: 'query' });
  queryControl = computed(() => this.formBuilder.control(this.queryInitial()));

  searchResults$ = toObservable(this.queryControl).pipe(
    switchMap((c) => c.valueChanges.pipe(startWith(c.value))),
    switchMap((query) => this.bookmarksService.search(query)),
  );
  searchResults = toSignal(this.searchResults$);

  cardAnimations = SEARCH_RESULT_CARD_ANIMATIONS;
  cards = computed(
    () => [
      {
        headline: 'Headline',
        url: 'https://domain.com/asdfasdfasdf.html',
        cover: 'https://domain.com/asdfasdfasdf.jpg',
        coverRatio: 3 / 2,
        summary: 'adsfasfasdasdf',
      },
      {
        headline: 'Headline',
        url: 'https://domain.com/asdfasdfasdf.html',
        cover: 'https://domain.com/asdfasdfasdf.jpg',
        coverRatio: 2 / 3,
        summary: 'adsfasfasdasdf',
      },
      {
        headline: 'Headline',
        url: 'https://domain.com/asdfasdfasdf.html',
        cover: 'https://domain.com/asdfasdfasdf.jpg',
        coverRatio: 3 / 5,
        summary: 'adsfasfasdasdf',
      },
      {
        headline: 'Headline',
        url: 'https://domain.com/asdfasdfasdf.html',
        cover: 'https://domain.com/asdfasdfasdf.jpg',
        coverRatio: 4 / 7,
        summary: 'adsfasfasdasdf',
      },
      {
        headline: 'Headline',
        url: 'https://domain.com/asdfasdfasdf.html',
        cover: 'https://domain.com/asdfasdfasdf.jpg',
        coverRatio: 4 / 5,
        summary: 'adsfasfasdasdf',
      },
      {
        headline: 'Headline',
        url: 'https://domain.com/asdfasdfasdf.html',
        cover: 'https://domain.com/asdfasdfasdf.jpg',
        coverRatio: 4 / 6,
        summary: 'adsfasfasdasdf',
      },
    ],
    // const results = this.searchResults();
    // return results?.map((result) => ({
    //   headline: result.title,
    //   url: result.url,
    //   ...(bookmarkIsCaptured(result) && {
    //     cover: result.screenshot,
    //     summary: result.document,
    //   }),
    // }));
  );
}
