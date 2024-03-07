import { Component, Inject, OnInit } from '@angular/core';

import { Course } from 'src/app/interface/course';
import { CourseService } from 'src/app/services/course.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/interface/department';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit{
  items:Course[] = [];
  departments:Department[] = [];
  selectCourses: string | undefined;
  courses: any[] = [
    {value: 'courseName', viewValue: 'Course'},
    {value: 'departmentName', viewValue: 'Department'},
    {value: 'created_at', viewValue: 'Created At'},
  ];

  searchTerm: string = '';
  filteredItems:any;

  constructor( private dialog: MatDialog, private courseService : CourseService
    , private departmentServices: DepartmentService){}
  ngOnInit(): void {
    this.getCourseData();
    // this.getDepartment();
  }
  sort(query:string) {
    if(query == 'courseName') {
      this.items.sort((a, b) =>
      a.courseName.localeCompare(b.courseName)
      );
    } else if(query == 'departmentName') {
      this.items.sort((a, b) =>
      a.departmentName.localeCompare(b.departmentName)
      );
    } else  if (query == 'created_at'){
      this.items.sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
      );
    }
  }


  getCourseData () {
    this.courseService.getCoursesData().subscribe( (res: Course[]) => {
      this.items=res;
    });
  }

  refresh () {
    this.searchTerm = "";
    this.selectCourses = undefined;
    this.filteredItems = null;
    this.getCourseData();
  }

  search() {
    if(this.searchTerm == "" || !this.searchTerm) {
      this.filteredItems = null;
      return;
    }

    this.filteredItems = this.items.filter((item) =>
      item.courseName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // getDepartment() {
  //   this.departmentServices.getDepartmentData().subscribe( (res: Department[]) => {
  //     this.departments=res;
  //   });
  // }

  // findDepartmentById (id:any) {
  //   return this.departments.find(dep => dep.id == id);
  // }


  openAddDialog(): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      maxHeight: '55vh',
      width: '55vh',
      data: { dialog_type : 'ADD'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getCourseData();
      }
      // this.animal = result;
    });
  }

  openEditDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      maxHeight: '55vh',
      width: '55vh',
      data: { dialog_type : 'EDIT', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getCourseData();
      }
      // this.animal = result;
    });
  }

  openViewDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      maxHeight : '85vh',
      width: '55vh',
      data: { dialog_type : 'VIEW', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this. getCourseData () ;
      }
    });
  }

  openDeleteDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '55vh',
      data: { dialog_type : 'DELETE', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getCourseData();
      }
      // this.animal = result;
    });
  }
}


@Component({
  selector: 'app-course-dialog',
  templateUrl: './courseDialog.html',
  styleUrls: ['./course.component.css']
})

export class CourseDialogComponent implements OnInit{
  courseForm: FormGroup;
  selectedId:any;
  departments:Department[] = [];
  selectedDepartment: string | undefined;
  constructor(public dialogRef: MatDialogRef<CourseDialogComponent>,
    private courseServices : CourseService,
    private departmentServices : DepartmentService,
    private snackBar : MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      // console.log('datum', data);
      
      if(data.dialog_type=="EDIT") {
        this.selectedId = data.data.id;
        this.courseForm = new FormGroup({
          courseName: new FormControl(data.data.courseName, Validators.required),
          department : new FormControl(data.data.departmentId, Validators.required),
        });
      } else {
        if(data.dialog_type=="DELETE"){
          this.selectedId = data.data.id; 
        }
        this.courseForm = new FormGroup({
          courseName: new FormControl('', Validators.required),
          department: new FormControl('', Validators.required),
        });
      }
    }
    
  ngOnInit(): void {
      this.getDepartment();
  }

    result(res:boolean): void {
      if(res) {
        if(this.data.dialog_type =="ADD") {
          this. addCourse ()
        } else if(this.data.dialog_type=="EDIT"){
          this.updateCourse();
        } else {
          this.deleteCourse();
        }
      } else{
        this.dialogRef.close();
      }
    }

    trackByDepartment(index: number, item: any): number {
      return item.id;
    }

    getDepartment() {
      this.departmentServices.getDepartmentData().subscribe( (res: Department[]) => {
        this.departments=res;
      });
    }
    addCourse () {
      if(this.courseForm.invalid) {
        this.snackBar.open('Fill-up all the required fields', 'Close', {
          duration: 3000, 
          verticalPosition: 'bottom', 
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'], 
        });
        return;
      }
     
      const data = {
        courseName : this.courseForm.value.courseName,
        departmentId: this.courseForm.value.department
      }

      return this.courseServices.addCourse(data).subscribe(res => {
        this.dialogRef.close(res);
      });
  
    }

    updateCourse () {
    
      if(this.courseForm.invalid) {
        this.snackBar.open('Fill-up all the required fields', 'Close', {
          duration: 3000, 
          verticalPosition: 'bottom', 
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'], 
        });
        return;
      }
  
      const data = {
        courseName : this.courseForm.value.courseName,
        departmentId: this.courseForm.value.department
      }
      
      return this.courseServices.updateCourse(data, this.selectedId).subscribe(res =>{
        this.dialogRef.close(res);
      });
    }
  
    deleteCourse () {
      return this.courseServices.deleteCourse(this.selectedId).subscribe(res =>{
        this.dialogRef.close(res);
      });
    }
}
