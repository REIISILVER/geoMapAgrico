import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateActividad } from '../../interfaces/actividades.interfaces';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCalendar } from "@angular/material/datepicker";
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-form-actividades',
  imports: [MatFormFieldModule, MatInput, MatButtonModule, MatLabel, CommonModule, ReactiveFormsModule, MatSelect, MatOption, MatCard],
  templateUrl: './form-actividades.component.html',
  styleUrl: './form-actividades.component.css'
})
export class FormActividadesComponent {

  private fb = inject(FormBuilder);
  public FormAct: FormGroup = this.fb.group(
    {
      descripcion: this.fb.control('',[Validators.required]),
      nombre: this.fb.control('',[Validators.required]),
      tipo: this.fb.control('', [Validators.required])
    }
  );

  @Output() objecto = new EventEmitter<CreateActividad>
  @Output() modal_status = new EventEmitter<boolean>;


  enviarData(){
    if(this.FormAct.invalid){
      return console.error('Los datos no estan llenos')
    }

    this.objecto.emit(this.FormAct.value);
  }

  closeModal(){
    this.modal_status.emit(false)

  }




}
