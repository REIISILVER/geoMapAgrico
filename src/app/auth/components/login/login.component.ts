import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormField, MatLabel,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[{provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private routerM = inject(Router);
  private authServices = inject(AuthService);
  public loginForm: FormGroup = this.fb.group(
    {
      email: this.fb.control('',[Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'), Validators.required]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)])
    }
  );


  login(e: Event) {
    e.preventDefault();
    if(this.loginForm.invalid){
      console.error('Form is invalid');
      return;
    }


    console.log('Login data', this.loginForm.value);
    this.authServices.login_user(this.loginForm.value).subscribe(
      {
        next: (resp) => {
          console.log('Login response:', resp);
          // Handle successful login response here
          localStorage.setItem('token', resp.data);
          localStorage.setItem('user', resp.user);
          this.routerM.navigate(['/main/home']);
        },
        error: (err: HttpErrorResponse) =>{
          console.error('Login error:', err);
        }
      }
    )

  }

}
