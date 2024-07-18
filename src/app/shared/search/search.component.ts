import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  inject,
  input,
  TemplateRef,
} from '@angular/core';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bs-search',
  standalone: true,
  imports: [IconComponent, NgTemplateOutlet],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  leadingIcon = input('search');
  trailing = contentChild(SearchTrailingSlot);
}

@Directive({
  selector: '[bsSearchTrailing]',
  standalone: true,
})
export class SearchTrailingSlot {
  template = inject(TemplateRef);
}
