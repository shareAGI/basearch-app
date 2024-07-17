import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { from } from 'rxjs';

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

@Component({
  selector: 'adx-start',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
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
  private wallpaperLoader = inject(WallpaperLoader);

  wallpaper = toSignal(from(this.wallpaperLoader.load()));
  backgroundImage = computed(() => {
    const url = this.wallpaper && this.wallpaper()?.url;
    return `url(${url})`;
  });
}
