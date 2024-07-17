import { DOCUMENT } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import {
  RootElementStylePropertiesThemeTokenRegistry,
  ThemeTokenRegistry,
} from '@angularity/theming';

@Injectable({ providedIn: 'root' })
class NullThemeTokenRegistry implements ThemeTokenRegistry {
  set(name: string, value: string | null): void {}
  get(name: string): string | null {
    return null;
  }
}

const isBrowser = typeof window !== 'undefined';
const document = isBrowser && window.document;
const tokens = isBrowser
  ? Injector.create({
      providers: [
        { provide: DOCUMENT, useValue: window.document },
        {
          provide: ThemeTokenRegistry,
          useClass: RootElementStylePropertiesThemeTokenRegistry,
        },
      ],
    }).get(ThemeTokenRegistry)
  : new NullThemeTokenRegistry();

const supportsLinearFunctionEasing = checkLinearFunctionEasingSupport();

export function variable(name: string): string {
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
  if (!document) return false;
  const element = document.createElement('div');
  document.body.appendChild(element);
  element.style.animationTimingFunction = 'linear(0, 1)';
  const interpreted = window.getComputedStyle(element).animationTimingFunction;
  element.remove();
  return interpreted.startsWith('linear(');
}
