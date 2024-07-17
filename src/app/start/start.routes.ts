import { Routes } from '@angular/router';

import { SearchFormComponent } from './search-form/search-form.component';
import { StartComponent } from './start.component';

export const START_ROUTES: Routes = [
  {
    path: '',
    component: StartComponent,
    children: [
      {
        path: '',
        component: SearchFormComponent,
      },
    ],
  },
];
