import { Component, Inject, OnInit } from '@angular/core';

import { DepartmentDialogComponent } from '../department/department.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Student } from 'src/app/interface/student';
import { StudentService } from 'src/app/services/student.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  items:Student[] = [];
  selectStudent: string | undefined;
  students: any[] = [
    {value: 'lastName', viewValue: 'Last Name'},
    {value: 'firstName', viewValue: 'Firste Name'},
    {value: 'created_at', viewValue: 'Created At'},
  ];
  constructor( private dialog: MatDialog, private studentService : StudentService){}
  ngOnInit(): void {
      this.getStudentData ();
  }

  sort(query:string) {
    if(query == 'firstName') {
      this.items.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
      );
    } else if (query == 'lastName'){
      this.items.sort((a, b) =>
      a.lastName.localeCompare(b.lastName)
      );
    } else  if (query == 'created_at'){
      this.items.sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
      );
    }
  }


  getStudentData () {
    this.studentService.getStudentData().subscribe( (res: Student[]) => {
      this.items=res;
    });
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '100vh',
      data: { dialog_type : 'ADD'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getStudentData();
      }
      // this.animal = result;
    });
  }

  openEditDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '80vh',
      data: { dialog_type : 'EDIT', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getStudentData();
      }
      // this.animal = result;
    });
  }


  openDeleteDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '80vh',
      data: { dialog_type : 'DELETE', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getStudentData();
      }
      // this.animal = result;
    });
  }
}




@Component({
  selector: 'app-student-dialog',
  templateUrl: './studentDialog.html',
  styleUrls: ['./student.component.css']
})

export class StudentDialogComponent implements OnInit{
  studentForm: FormGroup;
  selectedId:any;
  
  constructor(
    public dialogRef: MatDialogRef<DepartmentDialogComponent>,
    private studentServices : StudentService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('datum', data);
      
      if(data.dialog_type=="EDIT") {
        this.selectedId = data.data.id;
        let formattedDOB = new Date(data.data.DOB);
        this.studentForm = new FormGroup({
          firstName: new FormControl(data.data.firstName, Validators.required),
          lastName: new FormControl(data.data.lastName, Validators.required),
          DOB: new FormControl(formattedDOB, Validators.required),
          address: new FormControl(data.data.address, Validators.required),
        });
      } else {
        if(data.dialog_type=="DELETE"){
          this.selectedId = data.data.id; 
        }
        this.studentForm = new FormGroup({
          firstName: new FormControl('', Validators.required),
          lastName: new FormControl('', Validators.required),
          DOB : new FormControl('', Validators.required),
          address: new FormControl('', Validators.required),
        });
      }
     
    }

  ngOnInit(): void {
      
  }

  result(res:boolean): void {
    if(res) {
      if(this.data.dialog_type =="ADD") {
        this. addStudent ()
      } else if(this.data.dialog_type=="EDIT"){
        this.updateStudent();
      } else {
        this.deleteStudent();
      }
    } else{
      this.dialogRef.close();
    }
  }

  addStudent () {

    if(this.studentForm.invalid) {
      return;
    }

    let transformedDate = moment(this.studentForm.value.DOB).format('YYYY/MM/DD');

    const data = {
      firstName : this.studentForm.value.firstName,
      lastName : this.studentForm.value.lastName,
      DOB : transformedDate,
      address : this.studentForm.value.address
    }

    return this.studentServices.addStudent(data).subscribe(res => {
      this.dialogRef.close(res);
    });

  }


  updateStudent () {
    
    if(this.studentForm.invalid) {
      return;
    }

    let transformedDate = moment(this.studentForm.value.DOB).format('YYYY/MM/DD');

    const data = {
      firstName : this.studentForm.value.firstName,
      lastName : this.studentForm.value.lastName,
      DOB : transformedDate,
      address : this.studentForm.value.address
    }
    
    return this.studentServices.updateStudent(data, this.selectedId).subscribe(res =>{
      this.dialogRef.close(res);
    });
  }

  deleteStudent () {
    return this.studentServices.deleteStudent(this.selectedId).subscribe(res =>{
      this.dialogRef.close(res);
    });
  }
}