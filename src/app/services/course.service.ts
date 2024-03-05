import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  API_URL = environment.API_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http : HttpClient) { }



  getCoursesData () : Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/course`);
  }

  addCourse (data:any): Observable<any[]> {
    console.log('serviceData', data)
    return this.http.post<any[]>(`${this.API_URL}/course`, data);
  }

  updateCourse (data:any, id:any) {
    return this.http.put<any[]>(`${this.API_URL}/course/update/${id}`, data);
  }

  deleteCourse(id: number): Observable<any> {
    const apiUrl = `${this.API_URL}/course/delete/${id}`;
    return this.http.delete<any>(apiUrl);
  }
}
