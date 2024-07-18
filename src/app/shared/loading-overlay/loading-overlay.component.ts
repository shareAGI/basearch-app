import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';

@Component({
  selector: 'adx-loading-overlay',
  standalone: true,
  imports: [LoadingIndicatorComponent],
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent {}
