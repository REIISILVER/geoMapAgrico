import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-modal-create-parcela',
  imports: [MatFormFieldModule,MatInputModule, ReactiveFormsModule, MatButtonModule],
   providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  templateUrl: './modal-create-parcela.component.html',
  styleUrl: './modal-create-parcela.component.css'
})
export class ModalCreateParcelaComponent {
  private fb = inject(FormBuilder)
  public parcela: FormGroup = this.fb.group({
    nombre: this.fb.control('',[Validators.required]),

  })
  @Output()
  public formulario = new EventEmitter<string>

  @Output()
  ModalEmitter = new EventEmitter<boolean>;


  crearForm(){
    if(this.parcela.invalid){
      console.error('El formulario no puede estar vacio')
      return
    }
    console.log('enviando datos.....')
    this.formulario.emit(this.parcela.value)
  }

    disableModal() {
    this.ModalEmitter.emit(false);
  }
}
