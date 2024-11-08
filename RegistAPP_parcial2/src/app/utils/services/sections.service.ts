import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  private apiUrl = 'http://localhost:3000/api/sections';

  constructor(private http: HttpClient) {}

  getSections(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}