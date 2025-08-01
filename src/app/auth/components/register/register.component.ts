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

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, CommonModule, RouterLink],
  providers: [ {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public rols: Rols[] = [{id: 1, description: 'gerente'}, {id: 2, description: 'operario'}];
  private userService = inject(AuthService);
  private fv = inject(FormBuilder);
  public registerForm: FormGroup = this.fv.group(
    {
      name: this.fv.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fv.control('', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'), Validators.required]),
      password: this.fv.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fv.control('', [Validators.required, Validators.minLength(6)]),
      rol : this.fv.control('', [Validators.required])
    }
  )


  createUser(e: Event){
    e.preventDefault();
    // Logic to create a user will go here
    if(this.registerForm.invalid){
      console.error('Form is invalid');
      console.log(this.registerForm.hasError('email'));
      return;
    }

    console.log('User created', this.registerForm.value);
    this.userService.register_user(this.registerForm.value).subscribe(
      {
        next:(resp) => {
          console.log('User registered successfully', resp);
        },
        error:(err) => {
          console.error('Error registering user', err);

        }
      }
    )
  }


  evaluatePasswordMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

}
