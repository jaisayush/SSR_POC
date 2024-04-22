import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'class',
    loadComponent: () =>
      import('./class-details/class-details.component').then(
        (x) => x.ClassDetailsComponent
      ),
  },
];
