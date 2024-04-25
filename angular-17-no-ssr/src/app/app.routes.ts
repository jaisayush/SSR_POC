import { Routes } from '@angular/router';
import { ClassDetailsComponent } from './class-details/class-details.component';

export const routes: Routes = [
  {
    path: 'students/:classId',
    loadComponent: () =>
      import('./student-details/student-details.component').then(
        (x) => x.StudentDetailsComponent
      ),
  },
  {
    path: 'add-student',
    loadComponent: () =>
      import('./add-students/add-students.component').then(
        (x) => x.AddStudentsComponent
      ),
  },
  {
    path: '**',
    component: ClassDetailsComponent,
  },
];
