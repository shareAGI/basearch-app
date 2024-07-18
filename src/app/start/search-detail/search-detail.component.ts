import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IconComponent } from '../../shared/icon/icon.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { ShortUrlPipe } from '../../shared/short-url.pipe';
import { SearchContainerComponent } from '../core/search-container/search-container.component';

@Component({
  selector: 'bs-search-detail',
  standalone: true,
  imports: [
    SearchContainerComponent,
    IconButtonComponent,
    IconComponent,
    ShortUrlPipe,
  ],
  templateUrl: './search-detail.component.html',
  styleUrl: './search-detail.component.scss',
})
export class SearchDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  url = input.required<string>();
  headline = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();

  onCloseClick(): void {
    this.router.navigate([{}], { relativeTo: this.route });
  }
}
