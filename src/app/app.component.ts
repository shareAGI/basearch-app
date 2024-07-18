import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoadingIndicatorComponent } from './shared/loading-indicator/loading-indicator.component';

@Component({
  selector: 'adx-root',
  standalone: true,
  imports: [RouterOutlet, LoadingIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
