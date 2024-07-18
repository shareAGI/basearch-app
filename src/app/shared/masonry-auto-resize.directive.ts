import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { bufferTime, Subject } from 'rxjs';

@Directive({
  selector: 'ngx-masonry',
  standalone: true,
})
export class MasonryAutoResizeDirective implements OnInit, OnDestroy {
  private element = inject(ElementRef).nativeElement as HTMLElement;
  private masonry = inject(NgxMasonryComponent);
  private observer = new ResizeObserver(() => this.resize$.next(undefined));
  private resize$ = new Subject();

  ngOnInit(): void {
    this.observer.observe(this.element);
    this.resize$.pipe(bufferTime(200)).subscribe(() => this.masonry.layout());
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.element);
  }
}
