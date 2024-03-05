import { Component, Inject, OnInit } from '@angular/core';

import { DepartmentDialogComponent } from '../department/department.component';
import { Enrollment } from 'src/app/interface/enrollment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Student } from 'src/app/interface/student';
import { Course } from 'src/app/interface/course';
import { CourseService } from 'src/app/services/course.service';
import { StudentService } from 'src/app/services/student.service';
import * as moment from 'moment';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {

  items:Enrollment[] = [];
  filteredItems:any;
  selectEnrollment: string | undefined;

  enrollments: any[] = [
    {value: 'studentId', viewValue: 'Student'},
    {value: 'courseId', viewValue: 'Course'},
    {value: 'created_at', viewValue: 'Created At'},
  ];


  constructor(private enrollmentService : EnrollmentService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
      this. getEnrollmentData () ;
  }

  getEnrollmentData () {
    this.enrollmentService.getEnrollmentData().subscribe( (res: Enrollment[]) => {
      this.items=res;
    });
  }

  sort(query:string) {
    if(query == 'studentId') {
      this.items.sort((a, b) =>
      a.studentId.localeCompare(b.studentId)
      );
    }else if (query == 'courseId'){
      this.items.sort((a, b) =>
      a.courseId.localeCompare(b.courseId)
      );
    } else if (query == 'created_at'){
      this.items.sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
      );
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      maxHeight: '80vh',
      data: { dialog_type : 'ADD'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getEnrollmentData () ;
      }
    });
  }

  openEditDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      width: '80vh',
      data: { dialog_type : 'EDIT', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getEnrollmentData () ;
      }
    });
  }


  openDeleteDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      width: '80vh',
      data: { dialog_type : 'DELETE', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getEnrollmentData () ;
      }
    });
  }
}



@Component({
  selector: 'app-enrollment-dialog',
  templateUrl: './enrollmentDialog.html',
  styleUrls: ['./enrollment.component.css']
})

export class EnrollmentDialogComponent implements OnInit{ 
  enrollmentForm: FormGroup;
  selectedId:any;
  students:Student[] = [];
  courses:Course[] = [];
  enrollments:Enrollment[] = [];
  constructor( public dialogRef: MatDialogRef<EnrollmentDialogComponent>,
    private courseService : CourseService,
    private studentService : StudentService,
    private enrollmentService : EnrollmentService,
    private snackBar : MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any){

      console.log('datum', data);
      
      if(data.dialog_type=="EDIT") {
        this.selectedId = data.data.id;
        let formattedDOB = new Date(data.data.enrollment_date);
        this.enrollmentForm = new FormGroup({
          student: new FormControl(data.data.studentId, Validators.required),
          course: new FormControl(data.data.courseId, Validators.required),
          enrollment_date: new FormControl(formattedDOB, Validators.required),
        });
      } else {
        if(data.dialog_type=="DELETE"){
          this.selectedId = data.data.id; 
        }
        this.enrollmentForm = new FormGroup({
          student: new FormControl('', Validators.required),
          course: new FormControl('', Validators.required),
          enrollment_date: new FormControl('', Validators.required),
        });
      }
    }
  ngOnInit(): void {
   this.getCourseData();
   this.getStudentData();
   this.getEnrollment();
  }

  getCourseData () {
    this.courseService.getCoursesData().subscribe( (res: Course[]) => {
      this.courses=res;
    });
  }

  getStudentData () {
    this.studentService.getStudentData().subscribe( (res: Student[]) => {
      this.students=res;
    });
  }

  getEnrollment () {
    this.enrollmentService.getEnrollmentData().subscribe( (res: Enrollment[]) => {
      this.enrollments=res;
    });
  }
  trackByDepartment(index: number, item: any): number {
    return item.id;
  }

  result(res:boolean): void {
    if(res) {
      if(this.data.dialog_type =="ADD") {
        this.addEnrollment();
      } else if(this.data.dialog_type=="EDIT"){
        this.updateEnrollment();
      } else {
        this.deleteEnrollment();
      }
    } else{
      this.dialogRef.close();
    }
  }

  addEnrollment() {
    if(this.enrollmentForm.invalid){
      this.snackBar.open('Fill-up all the required fields', 'Close', {
        duration: 3000, 
        verticalPosition: 'bottom', 
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'], 
      });
      return;
    }

    const checkStudent = this.enrollments.find(en => en.studentId == this.enrollmentForm.value.student);
    if (checkStudent) {
      this.snackBar.open('There is a record already for this student', 'Close', {
        duration: 3000, // Duration in milliseconds
        verticalPosition: 'bottom', // You can also use 'bottom'
        horizontalPosition: 'center', // You can also use 'start' | 'end' | 'left' | 'right'
        panelClass: ['error-snackbar'], // Custom CSS class for styling
      });
      return;
    }

    console.log(this.enrollmentForm.value);
    let formattedDate = moment(this.enrollmentForm.value.enrollment_date).format('YYYY/MM/DD');
    const data = {
      studentId : this.enrollmentForm.value.student,
      courseId: this.enrollmentForm.value.course,
      enrollment_date: formattedDate
    }

    return this.enrollmentService.addEnrollment(data).subscribe(res => {
      this.dialogRef.close(res);
    });
  }

  
  updateEnrollment() {
    if(this.enrollmentForm.invalid){
      this.snackBar.open('Fill-up all the required fields', 'Close', {
        duration: 3000, 
        verticalPosition: 'bottom', 
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'], 
      });
      return;
    }

    const checkStudent = this.enrollments.find(en => en.studentId == this.enrollmentForm.value.student);
    if (checkStudent) {
      this.snackBar.open('There is a record already for this student', 'Close', {
        duration: 3000, 
        verticalPosition: 'bottom', 
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    console.log(this.enrollmentForm.value);
    let formattedDate = moment(this.enrollmentForm.value.enrollment_date).format('YYYY/MM/DD');
    const data = {
      studentId : this.enrollmentForm.value.student,
      courseId: this.enrollmentForm.value.course,
      enrollment_date: formattedDate
    }

    return this.enrollmentService.updateEnrollment(data, this.selectedId).subscribe(res => {
      this.dialogRef.close(res);
    });
  }

  deleteEnrollment () {
    return this.enrollmentService.deleteEnrollment(this.selectedId).subscribe(res =>{
      this.dialogRef.close(res);
    });
  }
}