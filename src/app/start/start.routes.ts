import { Routes } from '@angular/router';

import { SearchFormComponent } from './search-form/search-form.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
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
      {
        path: 'search',
        component: SearchPanelComponent,
      },
    ],
  },
];
