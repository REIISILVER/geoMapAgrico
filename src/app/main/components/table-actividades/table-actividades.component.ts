import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActividadesByCultivo } from '../../interfaces/actividades.interfaces';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { ActividadesService } from '../../services/actividades.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconButton } from "../../../../../node_modules/@angular/material/button/index";

@Component({
  selector: 'app-table-actividades',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule,],
  templateUrl: './table-actividades.component.html',
  styleUrl: './table-actividades.component.css'
})
export class TableActividadesComponent implements OnChanges {


  @Input()
  actividades!: ActividadesByCultivo[];

  @Output() mensjaeEmiter = new EventEmitter<string>;

  public editMode: boolean = false;

  private fb = inject(FormBuilder);
  private activiS = inject(ActividadesService);
  public formAct!: FormGroup

  public items!: FormArray


  ngOnChanges(changes: SimpleChanges): void {
    this.formAct = this.fb.group({
      items: this.fb.array([])
    });

    this.items = this.formAct.get('items') as FormArray

    //llenamos el items con los elementos del array de actividades
    const arrayForms = this.formAct.controls['items'].value
    this.actividades.forEach((item: ActividadesByCultivo) => {
      this.items.push(this.createItem(item))
    }
    );




  }




  createItem(item: ActividadesByCultivo): FormGroup {

    return this.fb.group(
      {
        id: [{ value: item.id, disabled: true }],
        nombre: [{ value: item.nombre, disabled: true }],
        descripcion: [{ value: item.descripcion, disabled: true }],
        tipo: [{ value: item.tipo, disabled: true }]
      }
    );
  }

  currentActividad(tipo: string, index: number): boolean {
    if (!this.actividades || !Array.isArray(this.actividades)) {
      return false;
    }
    return this.actividades[index].tipo === tipo
  }

  delete(actividad_id: number) {
    this.activiS.deleteActividad(actividad_id).subscribe(
      {
        next: (resp) => {

          //actualizamos el form eliminando el elemento
          const form = this.items.controls
          this.items.controls = form.filter((value) => value.get('id')?.value != actividad_id)
          this.mensjaeEmiter.emit(resp.mensaje)
        },
        error: (err: HttpErrorResponse) => {
          console.error(err)
        }
      }
    )
  }

  update(actividad_id: number) {
    this.editMode = true // activamos el modo edición
    const obj = this.items.controls

    const objt = obj[actividad_id]

    this.items.controls.forEach((value, index) => {
      //se almacena el id del elemento para su respectiva validación
      const id_elemento = value.get('id')

      if (id_elemento?.value == actividad_id) {

        value.get('nombre')?.enable();//esto va habilitar el control
        value.get('descripcion')?.enable();
        value.get('tipo')?.enable();
      }
    })




  }


  sendUpdateData(actividad_id: number) {
    this.editMode = false;
    this.items.controls.forEach((value) => {
      const id_e = value.get('id')

      if (id_e?.value == actividad_id) {

        value.get('nombre')?.disable();//esto va habilitar el control
        value.get('descripcion')?.disable();
        value.get('tipo')?.disable();

        this.activiS.updateActividad(value.value, actividad_id).subscribe(
          {
            next: (resp) => {

              this.mensjaeEmiter.emit(resp.mensaje)
            },
            error: (err: HttpErrorResponse) => {
              console.error(err)
              this.mensjaeEmiter.emit(err.error.mensaje)
            }
          }
        )
      }
    })
  }

  //funcion para cancelar actualización
  cancelarUpdate(actividad_id: number) {
    this.items.controls.forEach((value) => {
      const i_e = value.get('id')?.value

      if (i_e == actividad_id) {
        value.get('nombre')?.disable()
        value.get('descripcion')?.disable();
        value.get('tipo')?.disable();
      }
    })
  }


}
