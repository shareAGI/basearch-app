import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { listen, send } from '../../shared/messenger';
import { QueryWallpaper, QueryWallpaperResolved } from '../../shared/wallpaper';
import { useBrowserOnly } from '../common/platform-browser';
import { IconComponent } from '../shared/icon/icon.component';
import { IconButtonComponent } from '../shared/icon-button/icon-button.component';
import {
  SearchComponent,
  SearchTrailingSlot,
} from '../shared/search/search.component';
import { SearchControlComponent } from '../shared/search-control/search-control.component';

@Component({
  selector: 'adx-start',
  standalone: true,
  imports: [
    IconButtonComponent,
    [SearchComponent, SearchTrailingSlot, SearchControlComponent],
    IconComponent,
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  host: { '[style.background-image]': 'backgroundImage()' },
})
export class StartComponent {
  browserOnly = useBrowserOnly();

  wallpaper = this.browserOnly(() => {
    send(QueryWallpaper);
    return toSignal(listen(QueryWallpaperResolved));
  });

  backgroundImage = computed(() => {
    const url = this.wallpaper && this.wallpaper()?.url;
    return `url(${url})`;
  });
}
