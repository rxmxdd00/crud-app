import { CourseComponent, CourseDialogComponent } from './pages/course/course.component';
import { DepartmentComponent, DepartmentDialogComponent } from './pages/department/department.component';
import { EnrollmentComponent, EnrollmentDialogComponent } from './pages/enrollment/enrollment.component';
import { StudentComponent, StudentDialogComponent } from './pages/student/student.component';

import { AccordionComponent } from './components/accordion/accordion.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {FormsModule} from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { TeacherComponent } from './pages/teacher/teacher.component';

@NgModule({
  declarations: [
    AppComponent,
    AccordionComponent,
    DepartmentComponent,
    StudentComponent,
    CourseComponent,
    TeacherComponent,
    EnrollmentComponent,
    NavbarComponent,
    DepartmentDialogComponent,
    StudentDialogComponent,
    CourseDialogComponent,
    EnrollmentDialogComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkAccordionModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    NgSelectModule,
    MatPaginatorModule,
    MatTableModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
