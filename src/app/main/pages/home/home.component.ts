import { Component, ElementRef, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from '../../components/map/map.component';
import { CommonModule } from '@angular/common';
import { BarraBusquedaComponent } from '../../components/barra-busqueda/barra-busqueda.component';
import { ModalCreateParcelaComponent } from '../../components/modal-create-parcela/modal-create-parcela.component';
import { Geom, updateParcela } from '../../interfaces/draw.interfaces';
import { PrincipalService } from '../../services/principal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Parcelas, ParcelasInfo } from '../../interfaces/parcelas.interfaces';
import { ActividadesModalComponent } from '../../components/actividades-modal/actividades-modal.component';
import { SpinnerComponent } from '../../../barril/shared/spinner/spinner.component';
import { CultivosService } from '../../services/cultivos.service';
import { Cultivos } from '../../interfaces/cultivos.interfaces';
import { ModalUpdateComponent } from '../../components/modal-update/modal-update.component';
import { loadingSpinner } from '../../../../barril/helpers';
import { MessageComponent } from '../../../barril/message/message.component';


@Component({
  selector: 'app-home',
  imports: [MatIconModule, MapComponent, CommonModule, ModalCreateParcelaComponent, ActividadesModalComponent,
    SpinnerComponent, ModalUpdateComponent, MessageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  @ViewChild('main') main!: ElementRef<HTMLElement>
  @ViewChild('mapComponent') mapComponent!: MapComponent;

  user_id: number = Number(localStorage.getItem('user')) || 0;

  parcela_Info!: ParcelasInfo

  resultado: string = ''

  Nombre_parcela: string = ''

  objectGeom!: Geom

  ModalActive: boolean = false;

  ActividadModal: boolean = false;

  public loading: boolean = false;

  public parcelas: Parcelas[] = []

  public cultivos: Cultivos[] = []

  //status para actualizar o eliminar algun cultivo
  public status: boolean = false;
  public statusModal: boolean = false;
  //objeto que va a contener la parcela a actualizar
  public objParcelaUpdate!: updateParcela

  //estatus para eliminar la parcela
  public statusDelete: boolean = false;
  public showTooltip: boolean = false;

  //variables para mensajes
  public messageStatus: boolean = false;
  public mensaje: string = '';
  public color: string = '';
  //services

  private MainService = inject(PrincipalService);
  private cultServices = inject(CultivosService);

  ngOnInit(): void {
    this.StatusLoading()

    this.MainService.getParcelas(this.user_id).subscribe(
      {
        next: (resp) => {

          this.parcelas = resp.data

          this.StatusLoading();
        },
        error: (err: HttpErrorResponse) => {
          this.StatusLoading();
          console.error('Error al obtener las parcelas');
        }
      }
    )
  }

  getMessageFromCultive(e: string) {

    this.switchMensaje(e, true)

  }

  StatusModal(e: boolean) {
    this.ActividadModal = false;
    this.ModalActive = e
    if(!this.ModalActive){
      this.mapComponent.eliminarUltimoElemento();

    }
  }

  getParcela(e: string) {
    this.Nombre_parcela = e

    this.ModalActive = false
    //enviando al backend la parcela creada
    const v = JSON.parse(JSON.stringify(this.Nombre_parcela))

    const obj = {
      nombre: v.nombre,
      ubicacion: this.objectGeom,
      user_id: this.user_id
    }


    this.MainService.enviarParcela(obj).subscribe(
      {
        next: (res) => {

          this.switchMensaje(res.mensaje, true)
          //agregamos la parcela al array de parcelas para que se muestre en el mapa sin necesidad de recargar la pagina
           this.parcelas = [...this.parcelas, res.data];

          // TODO: Actualizar la lista de parcelas desde el backend para reflejar la nueva parcela
        },
        error: (err: HttpErrorResponse) => {
          console.error('error al enviar la parcela')

        }
      }
    )

  }

  almacenarParcela(e: Geom) {
    this.objectGeom = e
  }

  getInforParcela(e: ParcelasInfo) {
    this.parcela_Info = e
    this.ActividadModal = true
    //cargar los cultivos de la parcela seleccionada
    this.cargarCultivos(this.parcela_Info.id);
  }

  getCloseActividadModal(e: boolean) {
    this.ActividadModal = e
  }


  //
  StatusLoading() {
    this.loading = !this.loading
    const body = document.querySelector('main');


    if (this.loading) {
      body?.setAttribute('class', 'loading')
    } else {
      body?.removeAttribute('class')
    }
  }


  cargarCultivos(parcela_id: number) {
    this.cultServices.obtenerCultivos(parcela_id).subscribe(
      {
        next: (resp) => {

          this.cultivos = resp.data
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al obtener los cultivos');

        }
      }
    )
  }
  //se obtendra la desición de actualizar o eliminar una parcela de la modal
  getStausUpdate(e: boolean) {
    this.status = e;
    this.statusModal = false;

    //se hace la condicional para saber si se actualiza o elimina
    if (this.status) {
      //actualizar parcela


      this.MainService.updateParcela(this.objParcelaUpdate).subscribe(
        {
          next: (resp) => {

            this.switchMensaje(resp.mensaje, true)
          },
          error: (err: HttpErrorResponse) => {
            console.error('error al actualizar parcela')
            this.switchMensaje(err.message, false)
          }
        }
      )
      return
    }
  }

  getStatusModal(e: boolean) {
    this.statusModal = e;
  }

  getObjectModify(e: updateParcela) {
    this.objParcelaUpdate = e
  }

  getDeleteStatus(e: boolean) {
    this.StatusLoading();//se pone gris la pantalla
    this.statusDelete = e;
    this.loading = loadingSpinner(this.loading);
    if (this.statusDelete) {

      this.deleteParcela();
    } else {
      this.showTooltip = false;
    }
  }

  showTooltipDelete(e: boolean) {
    this.showTooltip = e;

  }

  deleteParcela() {
    this.loading = loadingSpinner(this.loading);
    const id_parcela = this.parcela_Info.id;
    this.MainService.DeleteParcela(id_parcela).subscribe(
      {
        next: (resp) => {

          this.ActividadModal = false;
          this.showTooltip = false;
          this.parcelas = this.parcelas.filter(parcela => parcela.id !== id_parcela);
           this.loading = loadingSpinner(this.loading);
           this.mensaje = resp.mensaje;
           this.color = 'green';
           this.messageStatus = true;
           setTimeout(() => {
             this.messageStatus = false;
           }, 3000);
        },
        error: (err: HttpErrorResponse) => {
          console.error('error al eliminar parcela');
          this.ActividadModal = false;
          this.loading = loadingSpinner(this.loading);
          this.mensaje = err.message;
          this.color = 'red';
          this.messageStatus = true;
          this.showTooltip = false;
          setTimeout(() => {
            this.messageStatus = false;
          }, 3000);

        }
      }
    )

  }


  switchMensaje(mensaje: string, status: boolean){
    if(status){
      this.mensaje = mensaje;
      this.color = 'green';
      this.messageStatus = true;
      setTimeout(() => {
        this.messageStatus = false;
      }, 3000);
    }else{
      this.mensaje = mensaje;
      this.color = 'red';
      this.messageStatus = true;
        setTimeout(() => {
        this.messageStatus = false;
      }, 3000);
    }
  }



}
