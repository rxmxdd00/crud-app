import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Department } from 'src/app/interface/department';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit{

  items:Department[] = [];
  filteredItems:any;
  selectedDepartment: string | undefined;

  departments: any[] = [
    {value: 'departmentName', viewValue: 'Department'},
    {value: 'created_at', viewValue: 'Created At'},
  ];

  constructor(private departmentServices : DepartmentService, private dialog: MatDialog){
    
  }

  ngOnInit(): void {
     this.getDepartmentData()
  }
 
  getDepartmentData() {
    this.departmentServices.getDepartmentData().subscribe( (res: Department[]) => {
      this.items=res;
    });
  }


  openAddDialog(): void {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '80vh',
      data: { dialog_type : 'ADD'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getDepartmentData();
      }
      // this.animal = result;
    });
  }

  openEditDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '80vh',
      data: { dialog_type : 'EDIT', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getDepartmentData();
      }
      // this.animal = result;
    });
  }


  openDeleteDialog(selectedData:any): void {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '80vh',
      data: { dialog_type : 'DELETE', data : selectedData}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getDepartmentData();
      }
      // this.animal = result;
    });
  }

  // filtered(query:string) {
  //   if(!query) {
  //     return;
  //   }
  //   console.log(this.items);
  //   this.items = this.items.filter(item => item.departmentName.toLowerCase().includes(query.toLowerCase()));
  //   console.log(this.items);
  // }

  sort(query:string) {
    if(query == 'departmentName') {
      this.items.sort((a, b) =>
      a.departmentName.localeCompare(b.departmentName)
      );
    } else if (query == 'created_at'){
      this.items.sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
      );
    }
  }
}


@Component({
  selector: 'app-department-dialog',
  templateUrl: './departmentDialog.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentDialogComponent implements OnInit{
  departmentForm: FormGroup;
  selectedId:any;
  constructor(
    public dialogRef: MatDialogRef<DepartmentDialogComponent>,
    private departmentServices : DepartmentService,
    private snackBar : MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      // console.log('datum', data);
      
      if(data.dialog_type=="EDIT") {
        this.selectedId = data.data.id;
        this.departmentForm = new FormGroup({
          departmentName: new FormControl(data.data.departmentName, Validators.required)
        });
      } else {
        if(data.dialog_type=="DELETE"){
          this.selectedId = data.data.id; 
        }
        this.departmentForm = new FormGroup({
          departmentName: new FormControl('', Validators.required)
        });
      }
     
    }

  ngOnInit(): void {
      
  }

  result(res:boolean): void {
    if(res) {
      if(this.data.dialog_type =="ADD") {
        this.addDepartment();
      } else if(this.data.dialog_type=="EDIT"){
        this.updateDepartment();
      } else {
        this.deleteDepartment();
      }
    } else{
      this.dialogRef.close();
    }
  }

  addDepartment (){
    if(this.departmentForm.invalid) {
      this.snackBar.open('Fill-up all the required fields', 'Close', {
        duration: 3000, 
        verticalPosition: 'bottom', 
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'], 
      });
      return;
    }
    const data ={
      departmentName : this.departmentForm.value.departmentName
    }
    return this.departmentServices.createDepartment(data).subscribe(res => {
      this.dialogRef.close(res);
    });
  }

  updateDepartment () {
    
    if(this.departmentForm.invalid) {
      return;
    }
    const data ={
      departmentName : this.departmentForm.value.departmentName
    }
    
    return this.departmentServices.updateDepartment(data, this.selectedId).subscribe(res =>{
      this.dialogRef.close(res);
    });
  }

  deleteDepartment () {
    return this.departmentServices.deleteDepartment(this.selectedId).subscribe(res =>{
      this.dialogRef.close(res);
    });
  }
}
