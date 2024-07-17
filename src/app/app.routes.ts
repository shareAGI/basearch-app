/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Routes } from '@angular/router';

import { START_ROUTES } from './start/start.routes';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'start',
        children: START_ROUTES,
      },
    ],
  },
];
