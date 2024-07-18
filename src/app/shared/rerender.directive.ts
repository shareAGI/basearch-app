import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[bsRerender]',
  standalone: true,
})
export class RerenderDirective<T> {
  private valueCurrent?: unknown;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<never>,
  ) {}

  @Input('bsRerender') set value(value: T) {
    if (value === this.valueCurrent) return;
    this.valueCurrent = value;
    this.viewContainer.clear();
    const context: RerenderDirectiveTemplateContext<T> = { bsRerender: value };
    this.viewContainer.createEmbeddedView(this.templateRef, context);
  }

  static ngTemplateContextGuard<T>(
    dir: RerenderDirective<T>,
    ctx: unknown,
  ): ctx is RerenderDirectiveTemplateContext<T> {
    return true;
  }
}

export interface RerenderDirectiveTemplateContext<T> {
  bsRerender: T;
}
