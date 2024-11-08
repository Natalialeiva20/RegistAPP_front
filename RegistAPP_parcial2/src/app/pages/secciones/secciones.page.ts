import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionsService } from 'src/app/utils/services/sections.service';

// Interfaz para definir la estructura de una sección
interface Section {
  section_id: number;
  subject_id: number;
  nombre_seccion: string;
}

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.page.html',
  styleUrls: ['./secciones.page.scss'],
})
export class SeccionesPage implements OnInit {
  sections: any[] = [];
  subjectId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sectionsService: SectionsService
  ) {}

  ngOnInit() {
    this.subjectId = Number(this.route.snapshot.paramMap.get('subjectId'));
    this.loadSections();
  }

  loadSections() {
    this.sectionsService.getSections().subscribe(
      (data: Section[]) => {
        this.sections = data.filter((section: Section) => section.subject_id === this.subjectId);
      },
      error => {
        console.error('Error al cargar las secciones', error);
      }
    );
  }

  goToClases(sectionId: number) {
    this.router.navigate([`/menu-profesor/secciones`, this.subjectId, 'clases', sectionId]);
  }
}