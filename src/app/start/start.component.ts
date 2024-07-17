import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { listen, send } from '../../shared/messenger';
import { QueryWallpaper, QueryWallpaperResolved } from '../../shared/wallpaper';
import { useBrowserOnly } from '../common/platform-browser';
import {
  ChipSelectComponent,
  ChipSelectOption,
} from '../shared/chip-select/chip-select.component';
import { IconComponent } from '../shared/icon/icon.component';
import { provideIcons } from '../shared/icon/icons';
import { IconButtonComponent } from '../shared/icon-button/icon-button.component';
import { iGitHub, iGoogle, iMicrosoft, iYouTube } from '../shared/icons';
import {
  SearchComponent,
  SearchTrailingSlot,
} from '../shared/search/search.component';
import { SearchControlComponent } from '../shared/search-control/search-control.component';

interface SearchEngine {
  name: string;
  scheme: string;
  icon: string;
}

const SEARCH_ENGINES: SearchEngine[] = [
  {
    name: 'Google',
    scheme: 'https://www.google.com/search?query=@',
    icon: 'iGoogle',
  },
  {
    name: 'Bing',
    scheme: 'https://bing.com/search?q=@',
    icon: 'iMicrosoft',
  },
  {
    name: 'YouTube',
    scheme: 'https://www.youtube.com/results?search_query=@',
    icon: 'iYouTube',
  },
  {
    name: 'GitHub',
    scheme: 'https://github.com/search?q=@',
    icon: 'iGitHub',
  },
];

@Component({
  selector: 'adx-start',
  standalone: true,
  imports: [
    IconButtonComponent,
    [SearchComponent, SearchTrailingSlot, SearchControlComponent],
    IconComponent,
    ChipSelectComponent,
  ],
  providers: [provideIcons({ iGoogle, iMicrosoft, iGitHub, iYouTube })],
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

  searchEngineOptions: ChipSelectOption[] = SEARCH_ENGINES.map((e) => ({
    label: e.name,
    value: e,
    icon: e.icon,
  }));
}
