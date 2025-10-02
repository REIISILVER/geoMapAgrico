import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import e from 'express';
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
          console.error('Error al obtener las parcelas', err);
        }
      }
    )
  }

  getMessageFromCultive(e: string) {

    this.switchMensaje(e, true)

  }

  StatusModal(e: boolean) {
    this.ModalActive = e
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
          console.log('respuesta del backend', res)
          this.switchMensaje(res.mensaje, true)
          //agregamos la parcela al array de parcelas para que se muestre en el mapa sin necesidad de recargar la pagina
           this.parcelas = [...this.parcelas, res.data];
          console.log('parcelas', this.parcelas)
          // TODO: Actualizar la lista de parcelas desde el backend para reflejar la nueva parcela
        },
        error: (err: HttpErrorResponse) => {
          console.error('error al enviar la parcela', err)

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
          console.log('Cultivos obtenidos:', resp);
          this.cultivos = resp.data
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al obtener los cultivos', err);

        }
      }
    )
  }
  //se obtendra la desición de actualizar o eliminar una parcela de la modal
  getStausUpdate(e: boolean) {
    this.status = e;
    this.statusModal = false;
    console.log('status para actualizar o eliminar:', this.status)
    //se hace la condicional para saber si se actualiza o elimina
    if (this.status) {
      //actualizar parcela

      console.log('actualizar parcela', this.objParcelaUpdate)
      this.MainService.updateParcela(this.objParcelaUpdate).subscribe(
        {
          next: (resp) => {
            console.log('parcela que se envio', this.objParcelaUpdate)
            console.log('parcela actualizada:', resp)
            this.switchMensaje(resp.mensaje, true)
          },
          error: (err: HttpErrorResponse) => {
            console.error('error al actualizar parcela:', err)
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
      console.log('eliminar parcela', this.parcela_Info.id)
      this.deleteParcela();
    } else {
      this.showTooltip = false;
    }
  }

  showTooltipDelete(e: boolean) {
    this.showTooltip = e;
    console.log('mostrar tooltip', this.showTooltip)
  }

  deleteParcela() {
    this.loading = loadingSpinner(this.loading);
    const id_parcela = this.parcela_Info.id;
    this.MainService.DeleteParcela(id_parcela).subscribe(
      {
        next: (resp) => {
          console.log('parcela eliminada', resp);
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
          console.error('error al eliminar parcela', err);
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
