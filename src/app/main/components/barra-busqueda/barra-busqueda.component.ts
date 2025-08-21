import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-barSearch',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './barra-busqueda.component.html',
  styleUrl: './barra-busqueda.component.css'
})
export class BarraBusquedaComponent {
  private fb = inject(FormBuilder)
  public busqueda: FormGroup = this.fb.group(
    {
      inpB: this.fb.control('')
    }
  )

  @Output()
  result = new EventEmitter<string>()

  enviar() {
    const value: string = this.busqueda.controls['inpB'].value
    if (value) {


      this.result.emit(value)
    } else {
      console.error('no se admiten valores nulos')
    }

  }

}
