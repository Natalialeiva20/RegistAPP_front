import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Cambia esta URL por la de tu endpoint
 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body, { headers });
  }
  async validatePassword(userId: number, password: string): Promise<boolean> {
    const body = { userId, password };
  
    try {
      const result = await this.http.post<boolean>(`${this.apiUrl}/compare-password`, body).toPromise();
      if (result === undefined) {
        return false; // Si el resultado es undefined, devolvemos false
      }
      return result;
    } catch (error) {
      // Manejo de errores
      console.error(error);
      return false; // En caso de error, devolvemos false
    }
  }

  changePassword(userId: number, newPassword: string): Promise<void> {
    const body = {
      userId,
      newPassword,
    };

    return this.http.post<void>(`${this.apiUrl}/change-password`, body).toPromise();
  }
}

