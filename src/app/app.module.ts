import { AccordionComponent } from './components/accordion/accordion.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { CourseComponent } from './pages/course/course.component';
import { DepartmentComponent } from './pages/department/department.component';
import { EnrollmentComponent } from './pages/enrollment/enrollment.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { StudentComponent } from './pages/student/student.component';
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
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
