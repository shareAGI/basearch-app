import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { listen, send } from '../../shared/messenger';
import { QueryWallpaper, QueryWallpaperResolved } from '../../shared/wallpaper';
import { useBrowserOnly } from '../common/platform-browser';

@Component({
  selector: 'adx-start',
  standalone: true,
  imports: [],
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
