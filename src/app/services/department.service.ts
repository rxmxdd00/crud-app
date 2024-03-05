import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  departmentData : any;
  API_URL = environment.API_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http : HttpClient) { }

  getDepartmentData () : Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/department`);
  }

  createDepartment (data:any): Observable<any[]> {
    
    return this.http.post<any[]>(this.API_URL +'/department/create', data);
  }

  updateDepartment (data:any, id:any) {
    return this.http.put<any[]>(`${this.API_URL}/department/update/${id}`, JSON.stringify(data), this.httpOptions);
  }

  deleteDepartment(id: number): Observable<any> {
    const apiUrl = `${this.API_URL}/department/delete/${id}`;
    return this.http.delete<any>(apiUrl);
  }
}
