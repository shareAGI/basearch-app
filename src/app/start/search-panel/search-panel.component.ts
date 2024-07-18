import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMasonryModule } from 'ngx-masonry';
import { startWith, switchMap } from 'rxjs';

import { bookmarkIsDetailed } from '../../../shared/bookmark';
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
import { SearchContainerComponent } from '../core/search-container/search-container.component';
import { SearchDetailComponent } from '../search-detail/search-detail.component';
import { SearchResultCardComponent } from '../search-result-card/search-result-card.component';

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
    SearchContainerComponent,
    SearchDetailComponent,
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder).nonNullable;
  private bookmarksService = inject(BookmarkService);

  queryInitial = input.required<string>({ alias: 'query' });
  queryControl = computed(() => this.formBuilder.control(this.queryInitial()));

  searchResults$ = toObservable(this.queryControl).pipe(
    switchMap((c) => c.valueChanges.pipe(startWith(c.value))),
    switchMap((query) => this.bookmarksService.search(query)),
  );
  searchResults = toSignal(this.searchResults$);

  futureSelectionIndex = signal<number | undefined>(undefined);
  selectedIndex = input<number | undefined>(undefined, { alias: 'selected' });
  selected = computed(() => {
    const index = this.selectedIndex();
    return index !== undefined && this.searchResults()?.[index];
  });
  select = (index: number): void => {
    this.futureSelectionIndex.set(index);
    this.router.navigate(
      [{ selected: index }], //
      { relativeTo: this.route },
    );
  };

  cards = computed(() => {
    const results = this.searchResults();
    return results?.map((result) => ({
      headline: result.title,
      url: result.url,
      ...(bookmarkIsDetailed(result) && {
        cover: result.imageUrl,
        coverRatio: result.imageRatio,
        summary: result.summary,
      }),
    }));
  });
}
