import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/utils/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  userId!: number; // Obtener el ID del usuario

  constructor(private authService: AuthService, private alertController: AlertController, private router: Router) {} 

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId'));

    
  }

  async validateCurrentPassword(): Promise<boolean> {
    try {
      const isValid = await this.authService.validatePassword(this.userId, this.currentPassword);
      if (!isValid) {
        await this.showAlert('Error', 'La contraseña actual no es correcta');
      }
      return isValid;
    } catch (error) {
      await this.showAlert('Error', 'Error al validar la contraseña actual');
      return false;
    }
  }

  async changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      await this.showAlert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    const isValid = await this.validateCurrentPassword();
    if (!isValid) {
      return;
    }

    try {
      await this.authService.changePassword(this.userId, this.newPassword);
      await this.showAlert('Éxito', 'La contraseña ha sido cambiada exitosamente');
      await  this.router.navigate(['/login']);
    } catch (error) {
      await this.showAlert('Error', 'Hubo un problema al cambiar la contraseña');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}