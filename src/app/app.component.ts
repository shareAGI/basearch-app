import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Wallpaper } from '../shared/wallpaper';
import { LoadingIndicatorComponent } from './shared/loading-indicator/loading-indicator.component';

@Component({
  selector: 'adx-root',
  standalone: true,
  imports: [RouterOutlet, LoadingIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: { '[style.background-image]': 'backgroundImage' },
})
export class AppComponent {
  wallpaper = inject(Wallpaper);
  backgroundImage = `url(${this.wallpaper.dataUrl})`;
}
