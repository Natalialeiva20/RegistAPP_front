import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionsService } from 'src/app/utils/services/sections.service';
import { SubjectsService } from 'src/app/utils/services/subjects.service';

@Component({
  selector: 'app-menu-profesor',
  templateUrl: './menu-profesor.page.html',
  styleUrls: ['./menu-profesor.page.scss'],
})
export class MenuProfesorPage implements OnInit {
  userName: string | null = '';
  subjects: any[] = [];

  constructor(private subjectsService: SubjectsService, private router: Router) {}

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectsService.getSubjects().subscribe(
      data => {
        this.subjects = data;
      },
      error => {
        console.error('Error al cargar las asignaturas', error);
      }
    );
  }

  goToSections(subjectId: number) {
    this.router.navigate([`/menu-profesor/secciones`, subjectId]);
  }


  navigateToChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
