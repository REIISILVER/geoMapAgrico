import { Component, EventEmitter, inject, Input, output, Output } from '@angular/core';
import { ParcelasInfo } from '../../interfaces/parcelas.interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../barril/shared/spinner/spinner.component';
import { loadingSpinner } from '../../../../barril/helpers';
import { set } from 'ol/transform';
import { Cultivos, CultivosToSend } from '../../interfaces/cultivos.interfaces';
import { CultivosService } from '../../services/cultivos.service';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { PrincipalService } from '../../services/principal.service';


@Component({
  selector: 'app-actividades-modal',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInput, MatDatepickerModule, CommonModule, ReactiveFormsModule,SpinnerComponent, MatIconModule,
     MatTooltipModule,  RouterLink],
  templateUrl: './actividades-modal.component.html',
  styleUrl: './actividades-modal.component.css',

})
export class ActividadesModalComponent {
  @Input()
  public actividades: Cultivos[]  = []
  @Input()
  public informacionParcela: ParcelasInfo = {
    id: 0,
    nombre: '',
    user_id: 0
  }

  @Output()
  public closeModal = new EventEmitter<boolean>;

  @Output()
  public DeleteStatus = new EventEmitter<boolean>;

  //TODO: tooltip para confirmar la eliminacion de la parcela
  //Solucionar el problema de que al eliminar una parcela no lo permite por alguna restriccion en la base de datos

  private fb = inject(FormBuilder);

  public formCultivo: FormGroup = this.fb.group(
    {
      tipo : this.fb.control('', [Validators.required]),
      fecha_cultivo: this.fb.control('', [Validators.required]),
      fecha_cosecha: this.fb.control('', [Validators.required]),
    }
  )

  public loading: boolean = false;
  public agCultivo: boolean = false;

  //emisor de mensaje exito o error al guardar el cultivo
  @Output()
  public mensaje = new EventEmitter<string>();

  private cultivosService = inject(CultivosService);
  private Pservice = inject(PrincipalService);


  cancel(){

    this.closeModal.emit(false);
  }

  guardarCultivo(){
    if(this.formCultivo.invalid){
      console.error('Formulario inválido');
      return;
    }

    if(!this.validarFechas()){
      return;
    }
    this.loading = loadingSpinner(this.loading);

    const obj:CultivosToSend = this.formCultivo.value;
    obj.parcela_id = this.informacionParcela.id;

    //arreglamos el formato de las fechas
    obj.fecha_cultivo = new Date(obj.fecha_cultivo.toISOString().split('T')[0]);
    obj.fecha_cosecha = new Date(obj.fecha_cosecha.toISOString().split('T')[0]);

    this.cultivosService.guardarCultivo(obj).subscribe(
      {
        next: (resp) => {
          this.loading = loadingSpinner(this.loading);

          this.formCultivo.reset();
          this.agCultivo = false;
          //añadir el nuevo cultivo a la lista de cultivos
          this.actividades.push(resp.data);
          this.mensaje.emit(resp.mensaje);
        },
        error: (err) => {
          this.loading = loadingSpinner(this.loading);
          console.error('Error al guardar el cultivo', err);
           this.formCultivo.reset();
          this.agCultivo = false;
        }
      }
    );



  }
  //filtro para que no se pueda seleccionar fechas posteriora  a la fecha actual
  filtroFecha = (d: Date | null): boolean => {
    const da = (d || new Date());
    const hoy = new Date();
    //necesitamos la fecha de ayer para ello restamos un día a la fecha actual
    hoy.setDate(hoy.getDate() -1 );

    if (da < hoy) {
      return false; // No permitir seleccionar fechas pasadas
    }
    return true; // permitir seleccionar fechas
  }

  validarFechas(){
    const fechaCultivo = new Date(this.formCultivo.value.fecha_cultivo);
    const fechaCosecha = new Date(this.formCultivo.value.fecha_cosecha);

    if(fechaCosecha < fechaCultivo){
      console.error('La fecha de cosecha no puede ser anterior a la fecha de cultivo');
      return false;
    }
    return true;
  }

  activatFormAddCultivo(value: boolean){
    this.agCultivo = value;
  }

  eliminarCultivo(cultivo_id: number){
    this.loading = loadingSpinner(this.loading);
    this.cultivosService.eliminarCultivo(cultivo_id).subscribe({
      next: (resp) => {
        this.loading = loadingSpinner(this.loading);

        // Actualizar la lista de cultivos después de eliminar uno
        this.actividades = this.actividades.filter(cultivo => cultivo.id !== cultivo_id);
      },
      error: (err: HttpErrorResponse) => {
          this.loading = loadingSpinner(this.loading);
        console.error('Error al eliminar el cultivo', err);
      }
    })
  }

  //eliminar parcela completa
  deleteParcela(){
    //utlizamos un tooltip para confirmar la eliminacion
    const id_parcela = this.informacionParcela.id;

    //enviar el emiter de que se va a eliminar la parcela
    this.DeleteStatus.emit(true);

  }


  // redireccionarDetalle(cultivo_id: number){
  //   this.router.navigate(['/main/cultivo/'+cultivo_id]);
  // }

}
