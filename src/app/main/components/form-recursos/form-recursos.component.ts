import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { recursosUnidades } from '../../../../barril/helpers';
import {MatButtonModule } from "@angular/material/button";
import { FormRecursos } from '../../interfaces/recursosInterfaces';

@Component({
  selector: 'app-form-recursos',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatLabel, MatSelect, MatOption, MatButtonModule],
  templateUrl: './form-recursos.component.html',
  styleUrl: './form-recursos.component.css'
})
export class FormRecursosComponent {

  @Output() cerrarModal = new EventEmitter<boolean>

  @Output() obj = new EventEmitter<FormRecursos>;


  //lista medidas para los insumos
  public medidas = recursosUnidades
  //formulario para crear recursos
  private fb = inject(FormBuilder);
  public formR : FormGroup = this.fb.group(
    {
      nombre: this.fb.control('',[Validators.required]),
      descripcion: this.fb.control('',[Validators.required]),
      tipo: this.fb.control('',[Validators.required]),
      cantidad: this.fb.control(0.00,[Validators.required]),
      unidad: this.fb.control('',[Validators.required]) //dar en kilos, etc...
    }
  )


  enviarRecursos(){
    if(this.formR.valid){
      this.obj.emit(this.formR.value)
    }else{
      console.error('datos inválidos')
    }
  }

  cancelar(){
    this.cerrarModal.emit(false);
  }



}
