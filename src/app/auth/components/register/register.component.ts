import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { Rols } from '../../interfaces/auth.interfaces';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../barril/shared/spinner/spinner.component';
import { loadingSpinner } from '../../../../barril/helpers';
import { MessageComponent } from '../../../barril/message/message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, CommonModule, RouterLink, SpinnerComponent, MessageComponent],
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public rols: Rols[] = [{ id: 1, description: 'gerente' }, { id: 2, description: 'operario' }];
  public loading: boolean = false;
  public mensaje: string = '';
  public showMessage: boolean = false;
  public color: string = '';
  private userService = inject(AuthService);
  private fv = inject(FormBuilder);
  public registerForm: FormGroup = this.fv.group(
    {
      name: this.fv.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fv.control('', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'), Validators.required]),
      password: this.fv.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fv.control('', [Validators.required, Validators.minLength(6)]),
      rol: this.fv.control('', [Validators.required])
    }
  )


  createUser(e: Event) {
    e.preventDefault();
    // Logic to create a user will go here
    if (this.registerForm.invalid) {
      console.error('Form is invalid');
      (this.registerForm.hasError('email'));
      return;
    }

    if(this.evaluatePasswordMatch() === false){
      this.switchMessage('Las contraseñas no coinciden', false);
      return;
    }
    this.loading = loadingSpinner(this.loading);


    this.userService.register_user(this.registerForm.value).subscribe(
      {
        next: (resp) => {

          this.loading = loadingSpinner(this.loading);
          this.switchMessage(resp.mensaje, true);
          this.registerForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error registering user', err);
          this.loading = loadingSpinner(this.loading);
           this.switchMessage(err.message, false);

        }
      }
    )
  }


  evaluatePasswordMatch(): boolean {

    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    return password === confirmPassword;
  }


  switchMessage(mensaje: string, status: boolean){
    //status true es valido, falso ocurrio un error
    if(status){
      this.mensaje = mensaje;
      this.color = 'rgb(0, 189, 214)';
      this.showMessage = true;
      setTimeout(()=>{
        this.showMessage = false;
      }, 3000)
    }else{
      this.mensaje = mensaje;
      this.color = 'rgb(211, 13, 46)';
      this.showMessage = true;
      setTimeout(()=>{
        this.showMessage = false;
      }, 3000)
    }
  }

}
