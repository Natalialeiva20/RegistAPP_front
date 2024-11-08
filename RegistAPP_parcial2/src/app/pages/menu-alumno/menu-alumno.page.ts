import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendancesService } from 'src/app/utils/services/attendances.service';

@Component({
  selector: 'app-menu-alumno',
  templateUrl: './menu-alumno.page.html',
  styleUrls: ['./menu-alumno.page.scss'],
})
export class MenuAlumnoPage implements OnInit {
  userName: string | null = '';
  studentId: number | null = null; // ID del estudiante
  sections: any[] = []; // Lista de secciones registradas

  constructor(private attendancesService: AttendancesService, private router: Router) {}

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.studentId = Number(localStorage.getItem('userId'));

    if (this.studentId) {
      this.loadStudentSections();
    } else {
      console.error('No se encontró el ID del estudiante.');
    }
  }

  loadStudentSections() {
    this.attendancesService.getStudentSections(this.studentId!).subscribe(
      (data) => {
        console.log('Secciones registradas:', data); // Verifica que los datos sean correctos
        this.sections = data;
      },
      (error) => {
        console.error('Error al cargar las secciones registradas:', error);
      }
    );
  }

  goToSectionAttendance(sectionId: number) {
    this.router.navigate(['/asistencias', sectionId]);
  }

  navigateToChangePassword() {
    this.router.navigate(['/change-password']);
  }
  
}