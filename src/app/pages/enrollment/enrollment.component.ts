import { Component, Inject, OnInit, ViewChild } from '@angular/core';

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
import { Department } from 'src/app/interface/department';
import { DepartmentService } from 'src/app/services/department.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {

  items:Enrollment[] = [];
  departments : Department[] = [];
  filteredItems:any;
  selectEnrollment: string | undefined;
  searchTerm: string = '';
  enrollments: any[] = [
    {value: 'lastName', viewValue: 'Student'},
    {value: 'courseName', viewValue: 'Course'},
    {value: 'created_at', viewValue: 'Created At'},
  ];

  // dataSource = new MatTableDataSource<Enrollment>;

  //   @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private enrollmentService : EnrollmentService, private dialog: MatDialog,
   private departmentService : DepartmentService) {

  }

  ngOnInit(): void {
    this. getEnrollmentData () ;
      this.getDepartment() ;
  }

  getEnrollmentData () {
    this.enrollmentService.getEnrollmentData().subscribe( (res: Enrollment[]) => {
      this.items=res;
      // this.dataSource.data = this.items;
      // const paginator = this.dataSource.paginator;
      
      // if (paginator) {
      //   paginator.pageSize = 10;
      //   paginator.pageIndex = 0;
      //   paginator.length = this.items.length;
      //   paginator.firstPage();
      // }
    });
    // console.log(this.dataSource);
  }

  getDepartment() {
    this.departmentService.getDepartmentData().subscribe( (res: Department[]) => {
      this.departments=res;
    });
  }

  findDepartmentById (id:any) {
    return this.departments.find(dep => dep.id == id);
  }

  sort(query:string) {
    if(query == 'lastName') {
      this.items.sort((a, b) =>
      a.lastName.localeCompare(b.lastName)
      );
    }else if (query == 'courseName'){
      this.items.sort((a, b) =>
      a.courseName.localeCompare(b.courseName)
      );
    } else if (query == 'created_at'){
      this.items.sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
      );
    }
  }

  search() {
    if(this.searchTerm == "" || !this.searchTerm) {
      this.filteredItems = null;
      return;
    }

    this.filteredItems = this.items.filter((item) =>
      item.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    // this.dataSource.data = this.filteredItems;
    // this.dataSource.paginator?.firstPage(); 
  }

  refresh() {
    this.searchTerm = "";
    this.selectEnrollment = undefined;
    this.filteredItems = null;
    this.getEnrollmentData();
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      maxHeight: '80vh',
      width: '55vh',
      data: { dialog_type : 'ADD'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getEnrollmentData () ;
        this.getDepartment() ;
      }
    });
  }

  openEditDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      maxHeight : '80vh',
      width: '55vh',
      data: { dialog_type : 'EDIT', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getEnrollmentData () ;
        this.getDepartment() ;
      }
    });
  }

  openViewDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      maxHeight : '85vh',
      width: '55vh',
      data: { dialog_type : 'VIEW', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getEnrollmentData () ;
        this.getDepartment() ;
      }
    });
  }


  openDeleteDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      width: '55vh',
      data: { dialog_type : 'DELETE', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getEnrollmentData () ;
        this.getDepartment() ;
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
  departments : Department[] = [];
  disableSelect = new FormControl(false);
  constructor( public dialogRef: MatDialogRef<EnrollmentDialogComponent>,
    private courseService : CourseService,
    private studentService : StudentService,
    private enrollmentService : EnrollmentService,
    private departmentService : DepartmentService,
    private snackBar : MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any){

      // console.log('datum', data);
      
      if(data.dialog_type=="EDIT") {
        this.selectedId = data.data.id;
        let formattedDOB = new Date(data.data.enrollment_date);
        this.enrollmentForm = new FormGroup({
          student: new FormControl({value: data.data.studentId, disabled: true}, Validators.required),
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
   this.getDepartment();
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

  getDepartment() {
    this.departmentService.getDepartmentData().subscribe( (res: Department[]) => {
      this.departments=res;
    });
  }

  getEnrollment () {
    this.enrollmentService.getEnrollmentData().subscribe( (res: Enrollment[]) => {
      this.enrollments=res;
    });
  }

  findDepartmentById (id:any) {
    return this.departments.find(dep => dep.id == id);
  }

  trackByStudent(index: number, item: any): number {
    return item.id;
  }

  trackByCourse(index: number, item: any): number {
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

    const studentIdToCheck = this.enrollmentForm.value.student;
    const courseIdToCheck = this.enrollmentForm.value.course;

    const isStudentEnrolled = this.enrollments.some(en => en.studentId === studentIdToCheck);

    if (isStudentEnrolled) {
      const isCourseEnrolled = this.enrollments.some(en => en.studentId === studentIdToCheck && en.courseId === courseIdToCheck);

      if (isCourseEnrolled) {
        this.snackBar.open('This student is already enrolled in the selected course', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
        });
        return;
      }
    }

    // const checkStudent = this.enrollments.find(en => en.studentId == this.enrollmentForm.value.student);
    // if (checkStudent) {
    //   this.snackBar.open('There is a record already for this student', 'Close', {
    //     duration: 3000, // Duration in milliseconds
    //     verticalPosition: 'bottom', // You can also use 'bottom'
    //     horizontalPosition: 'center', // You can also use 'start' | 'end' | 'left' | 'right'
    //     panelClass: ['error-snackbar'], // Custom CSS class for styling
    //   });
    //   return;
    // }

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

    // const checkStudent = this.enrollments.find(en => en.studentId == this.enrollmentForm.value.student);
    // if (checkStudent) {
    //   this.snackBar.open('There is a record already for this student', 'Close', {
    //     duration: 3000, 
    //     verticalPosition: 'bottom', 
    //     horizontalPosition: 'center',
    //     panelClass: ['error-snackbar'],
    //   });
    //   return;
    // }

    let formattedDate = moment(this.enrollmentForm.value.enrollment_date).format('YYYY/MM/DD');
    const data = {
      studentId : this.data.data.studentId,
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