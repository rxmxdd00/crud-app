import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  API_URL = environment.API_URL;
  constructor(private http:HttpClient) { }

  
  getEnrollmentData () : Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/enrollment`);
  }

  addEnrollment (data:any): Observable<any[]> {

    return this.http.post<any[]>(`${this.API_URL}/enrollment`, data);
  }

  updateEnrollment (data:any, id:any) {
    return this.http.put<any[]>(`${this.API_URL}/enrollment/update/${id}`, data);
  }

  deleteEnrollment(id: number): Observable<any> {
    const apiUrl = `${this.API_URL}/enrollment/delete/${id}`;
    return this.http.delete<any>(apiUrl);
  }
}
