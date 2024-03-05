import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  
  API_URL = environment.API_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http : HttpClient) { }


  getStudentData () : Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/student`);
  }

  addStudent (data:any): Observable<any[]> {

    return this.http.post<any[]>(`${this.API_URL}/student`, data);
  }

  updateStudent (data:any, id:any) {
    return this.http.put<any[]>(`${this.API_URL}/student/update/${id}`, data);
  }

  deleteStudent(id: number): Observable<any> {
    const apiUrl = `${this.API_URL}/student/delete/${id}`;
    return this.http.delete<any>(apiUrl);
  }
}
