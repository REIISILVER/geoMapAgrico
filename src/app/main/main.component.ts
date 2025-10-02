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

    this.auths.logou_user(user_id).subscribe({
      next: (data) => {
        console.log('datos: ', data)
        setTimeout(() => {
         this.router.navigate(['/auth/login'])
        }, 3000);

      },
      error: (err) => {
        console.error(err)
      }
    });
  }

}
