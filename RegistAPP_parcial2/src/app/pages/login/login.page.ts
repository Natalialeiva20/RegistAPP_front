import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        if (response.message === "Inicio de sesión exitoso") {
          const userName = response.user.nombre;
          const userRole = response.user.rol;
          const userId = response.user.userId;
          
          localStorage.setItem('userName', userName);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('userId', userId);

          // Redirige según el rol del usuario
          if (userRole === 'profesor') {
            this.router.navigate(['/menu-profesor']);
          } else if (userRole === 'estudiante') {
            this.router.navigate(['/menu-alumno']);
          }
        } else {
          alert('Error en las credenciales');
        }
      },
      error => {
        alert('Error en la conexión');
      }
    );
  }
}