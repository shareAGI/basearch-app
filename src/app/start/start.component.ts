import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

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
})
export class StartComponent {}
