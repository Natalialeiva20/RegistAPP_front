import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClassesService } from 'src/app/utils/services/classes.service';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.page.html',
  styleUrls: ['./clases.page.scss'],
  
})
export class ClasesPage implements OnInit {
  sectionId: number | null = null;
  profesorId!: number; // Asigna aquí el ID del profesor o recupera el valor dinámicamente
  groupedClasses: { [date: string]: any[] } = {};
  qrData: string | undefined = undefined;  // Cambia null por undefined
  today!: string;
  openQrClassId: string | null = null; // ID de la clase cuyo QR está abierto
  lastDate: string | null = null; // Almacena la última fecha disponible
  
  
  constructor(
    private route: ActivatedRoute,
    private classesService: ClassesService,
    private alertController: AlertController
  ) {
  }
  

  ngOnInit() {
    this.profesorId = Number(localStorage.getItem('userId'));
    this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
    if (this.sectionId) {
      this.loadClasses();
    }
  }

  loadClasses() {
    this.classesService.getClassesBySection(this.sectionId!).subscribe(
      classes => {
        this.groupClassesByDate(classes);
      },
      error => {
        console.error('Error al cargar las clases', error);
      }
    );
  }

  groupClassesByDate(classes: any[]) {
    this.groupedClasses = classes.reduce((groups, classItem) => {
      const date = new Intl.DateTimeFormat('es-CL', {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(classItem.fecha_hora));

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(classItem);
      return groups;
    }, {});

    // Obtener la última fecha (último día) en el grupo de clases
    const dates = Object.keys(this.groupedClasses);
    dates.sort(); // Aseguramos que las fechas estén ordenadas
    this.lastDate = dates[dates.length - 1]; // Almacenamos la última fecha
  }
  

  getGroupedClassDates(): string[] {
    return Object.keys(this.groupedClasses);
  }

  // Agrega un método para formatear la hora en la zona horaria de Santiago de Chile
  formatTime(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false, // Usa formato de 24 horas
      timeZone: 'America/Santiago' 
    };
    return new Intl.DateTimeFormat('es-CL', options).format(new Date(dateString));
  }


  async presentClassNamePrompt() {
    const alert = await this.alertController.create({
      header: 'Iniciar Clase',
      inputs: [
        {
          name: 'nombreClass',
          type: 'text',
          placeholder: 'Ingrese el nombre de la clase'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data.nombreClass && this.sectionId !== null) {
              this.startClass(data.nombreClass);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  startClass(nombreClass: string) {
    if (this.sectionId !== null) {
      this.classesService.startClass(this.profesorId, this.sectionId, nombreClass).subscribe(
        response => {
          console.log('Clase iniciada con éxito', response);
          this.loadClasses(); // Recarga las clases para mostrar la nueva clase en la lista
        },
        error => {
          console.error('Error al iniciar la clase', error);
        }
      );
    }
  }

  toggleQR(classId: string) {
    // Si el QR de la clase ya está abierto, ciérralo; si no, ábrelo
    this.qrData = this.qrData === classId ? undefined : classId;
  }

  openQR(classId: string) {
    if (this.openQrClassId === classId) {
      // Si ya está abierto, cierra el QR
      this.openQrClassId = null;
      this.qrData = undefined;
    } else {
      // Abre el QR de la clase seleccionada
      this.openQrClassId = classId;
      this.qrData = classId;
    }
  }
  
}
