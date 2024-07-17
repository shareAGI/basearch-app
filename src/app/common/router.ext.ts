// Workaround to emulate an injection context in route loaders.
// https://github.com/angular/angular/issues/51532#issuecomment-1956138610

import {
  ENVIRONMENT_INITIALIZER,
  inject,
  Injector,
  Provider,
  runInInjectionContext,
} from '@angular/core';
import { Route, Routes } from '@angular/router';
import { provideMulti } from '@angularity/core';
import { from, map, Observable, ObservableInput } from 'rxjs';

// eslint-disable-next-line max-lines-per-function
export function enableRoutesLoaderInjectionContext(children: Routes): Routes {
  let injector: Injector | undefined = undefined;
  const transformChild = (child: Route) => {
    if (child.children) child.children.forEach(transformChild);
    if (!child.loadChildren) return child;
    const loadChildren = child.loadChildren;
    child.loadChildren = (...args) => {
      if (!injector) throw new Error('Missing injector');
      return runInInjectionContext(injector, () => loadChildren(...args));
    };
    return child;
  };
  return [
    {
      path: '',
      providers: [
        provideMulti({
          token: ENVIRONMENT_INITIALIZER,
          useFactory:
            (i = inject(Injector)) =>
            () => {
              injector = i;
            },
        }),
      ],
      children: children.map(transformChild),
    },
  ];
}

export function loadChildrenWithAsyncProviders(config: {
  providers: () => ObservableInput<Provider[]>;
  children: Routes;
}): Observable<Routes> {
  const { children, providers } = config;
  return from(providers()).pipe(
    map((providers) => [
      {
        path: '',
        providers,
        children,
      },
    ]),
  );
}
