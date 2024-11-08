import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private apiUrl = 'http://localhost:3000/api/classes';

  constructor(private http: HttpClient) {}

  getClassesBySection(sectionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/section/${sectionId}`);
  }

  startClass(profesorId: number, sectionId: number, nombreClass: string): Observable<any> {
    const body = {
      profesor_id: profesorId,
      section_id: sectionId,
      nombre_class: nombreClass
    };
    return this.http.post(this.apiUrl, body);
  }
}