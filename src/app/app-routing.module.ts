import { RouterModule, Routes } from '@angular/router';

import { CourseComponent } from './pages/course/course.component';
import { DepartmentComponent } from './pages/department/department.component';
import { EnrollmentComponent } from './pages/enrollment/enrollment.component';
import { NgModule } from '@angular/core';
import { StudentComponent } from './pages/student/student.component';

const routes: Routes = [
  {path:'', redirectTo: '/student', pathMatch:'full'},
  {path: 'student',  component : StudentComponent },
  {path: 'course',  component : CourseComponent },
  {path: 'department',  component : DepartmentComponent },
  {path: 'enrollment',  component : EnrollmentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
