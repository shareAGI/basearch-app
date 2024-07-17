import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import {
  RootElementStylePropertiesThemeTokenRegistry,
  ThemeTokenRegistry,
} from '@angularity/theming';

const injector = Injector.create({
  providers: [
    { provide: DOCUMENT, useValue: window.document },
    {
      provide: ThemeTokenRegistry,
      useClass: RootElementStylePropertiesThemeTokenRegistry,
    },
  ],
});

const supportsLinearFunctionEasing = checkLinearFunctionEasingSupport();

export function variable(name: string): string {
  const tokens = injector.get(ThemeTokenRegistry);
  return tokens.get(name) ?? '';
}

export function duration(name: string): string {
  return variable(`sys-motion-duration-${name}`);
}
export function easing(name: string): string {
  // TODO: remove this once `linear()` easing is supported in all browsers
  if (name === 'emphasized') {
    if (!supportsLinearFunctionEasing)
      return variable(`sys-motion-easing-emphasized`);
    return variable(`sys-motion-easing-emphasized-experimental`);
  }
  return variable(`sys-motion-easing-${name}`);
}

function checkLinearFunctionEasingSupport(): boolean {
  const document = injector.get(DOCUMENT);
  const element = document.createElement('div');
  document.body.appendChild(element);
  element.style.animationTimingFunction = 'linear(0, 1)';
  const interpreted = window.getComputedStyle(element).animationTimingFunction;
  element.remove();
  return interpreted.startsWith('linear(');
}
