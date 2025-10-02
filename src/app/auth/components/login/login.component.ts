import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerComponent } from '../../../barril/shared/spinner/spinner.component';
import { loadingSpinner } from '../../../../barril/helpers';
import { MessageComponent } from '../../../barril/message/message.component';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormField, MatLabel, RouterLink, SpinnerComponent, MessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }]
})
export class LoginComponent {
  public loading: boolean = false;
  private fb = inject(FormBuilder);
  private routerM = inject(Router);
  private authServices = inject(AuthService);
  public loginForm: FormGroup = this.fb.group(
    {
      email: this.fb.control('', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'), Validators.required]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)])
    }
  );

  public mensaje: string = '';
  public color: string = '#0a5200ff';
  public messActive: boolean = false;


  login(e: Event) {
    e.preventDefault();

    if (this.loginForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    this.loading = loadingSpinner(this.loading);



    this.authServices.login_user(this.loginForm.value).subscribe(
      {
        next: (resp) => {
          this.loading = loadingSpinner(this.loading);

          // Handle successful login response here
          localStorage.setItem('token', resp.data);
          localStorage.setItem('user', resp.user);

          this.SwitchMessage(resp.mensaje, '#0a5200ff');
          //redireccionar a home

          this.routerM.navigate(['/main/home']);

        },
        error: (err: HttpErrorResponse) => {
          this.loading = loadingSpinner(this.loading);
          console.error('Login error:', err);
          this.SwitchMessage(err.error.mensaje, '#ff0000ff');
        }
      }
    )

  }

  SwitchMessage(mensaje: string, color: string) {
    this.messActive = true
    this.mensaje = mensaje;
    this.color = color;
    setTimeout(() => {
      this.messActive = false
    },1000);
  }




}
