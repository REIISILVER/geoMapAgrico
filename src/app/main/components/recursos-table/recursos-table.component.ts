import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Recursos } from '../../interfaces/recursosInterfaces';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RecursosService } from '../../services/recursos.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recursos-table',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatLabel, MatIconModule, MatInputModule, CommonModule],
  templateUrl: './recursos-table.component.html',
  styleUrl: './recursos-table.component.css'
})
export class RecursosTableComponent implements OnChanges {

  @Input() listaRecursos!: Recursos[]

  @Output() mensajeEmiter = new EventEmitter<string>

  private fb = inject(FormBuilder);
  private recursosS = inject(RecursosService);
  public formRecursos!: FormGroup

  public items!: FormArray

  public editmode: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {



    this.formRecursos = this.fb.group(
      {
        items: this.fb.array([])
      }
    )

    this.items = this.formRecursos.get('items') as FormArray

    this.listaRecursos.forEach((values) => {
      this.items.push(this.crearItem(values))
    })


  }


  crearItem(obj: Recursos): FormGroup {
    return this.fb.group({
      id: [{ value: obj.id, disabled: true }],
      nombre: [{ value: obj.nombre, disabled: true }],
      descripcion: [{ value: obj.descripcion, disabled: true }],
      tipo: [{ value: obj.tipo, disabled: true }],
      cantidad: [{ value: obj.cantidad, disabled: true }],
      unidad: [{ value: obj.unidad, disabled: true }]

    })
  }

  activarUpdate(id: number) {
    this.switchtEditMode(id)

  }

  sendUpdate(id: number) {
    this.switchtEditMode(id)
  }

  //implementar tambien en recursos y actividades la eliminacion y actualizacion en tiempo real

  deleteElemento(id_insumo: number) {
    this.recursosS.deleteRecurso(id_insumo).subscribe(
      {
        next: (resp) => {

          const form = this.items.controls
          this.items.controls = form.filter((value) => value.get('id')?.value != id_insumo)
          //TOD: ACTUALIZAR EL FORM CON LOS DATOS CORRECTOS
          this.emitirMensaje(resp.mensaje)
        },
        error: (err: HttpErrorResponse) => {
          console.error(err)
        }
      }
    )
  }


  switchtEditMode(id: number) {

    if (!this.editmode) {
      this.editmode = true;
      const form = this.items.controls
      form.forEach((value) => {
        if (value.get('id')?.value == id) {
          value.get('nombre')?.enable()
          value.get('descripcion')?.enable()
          value.get('tipo')?.enable()
          value.get('cantidad')?.enable()
          value.get('unidad')?.enable()


        }
      })
    } else {
      // TODO: utilizar la interfaz para actualizar
      const form = this.items.controls
      form.some((value) => {
        if (value.get('id')?.value == id) {
          //enviar el objeto actualizado

          value.get('nombre')?.disable()
          value.get('descripcion')?.disable()
          value.get('tipo')?.disable()
          value.get('cantidad')?.disable()
          value.get('unidad')?.disable()



          this.recursosS.updateRecursos(value.value, id).subscribe(
            {
              next: (resp) => {

                this.emitirMensaje(resp.mensaje)
              },
              error: (erro: HttpErrorResponse) => {
                console.error(erro)
              }
            }
          )

        }
      })


      this.editmode = false;
    }
  }

  cancelUpdate(id: number) {
    const form = this.items.controls
    form.some((value) => {
      if (value.get('id')?.value == id) {
        value.get('nombre')?.disable()
        value.get('descripcion')?.disable()
        value.get('tipo')?.disable()
        value.get('cantidad')?.disable()
        value.get('unidad')?.disable()
        this.editmode = false;
      }
    })
  }


  emitirMensaje(mensaje: string){
    this.mensajeEmiter.emit(mensaje)
  }



}
