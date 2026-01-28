import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, MatIcon, RouterLink, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  private auths = inject(AuthService);
  private router = inject(Router)

  logout(){
    const user_id = Number(localStorage.getItem('user'));
    //limpiamos los datos del localstorage
    localStorage.clear();
    this.router.navigate(['/auth/login'])
    //llamamos al servicio para cerrar la sesion en el backend
    this.auths.logou_user(user_id).subscribe({
      next: (data) => {
      },
      error: (err) => {
        console.error('Error al cerrar sesion')
      }
    });
  }

}
