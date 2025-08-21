import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from '../../components/map/map.component';
import { CommonModule } from '@angular/common';
import { BarraBusquedaComponent } from '../../components/barra-busqueda/barra-busqueda.component';
import { ModalCreateParcelaComponent } from '../../components/modal-create-parcela/modal-create-parcela.component';
import { Geom } from '../../interfaces/draw.interfaces';
import { PrincipalService } from '../../services/principal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Parcelas, ParcelasInfo } from '../../interfaces/parcelas.interfaces';
import { ActividadesModalComponent } from '../../components/actividades-modal/actividades-modal.component';
import { SpinnerComponent } from '../../../barril/shared/spinner/spinner.component';
import e from 'express';


@Component({
  selector: 'app-home',
  imports: [MatIconModule, MapComponent, CommonModule, BarraBusquedaComponent, ModalCreateParcelaComponent, ActividadesModalComponent, SpinnerComponent],
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

  private MainService = inject(PrincipalService)

  ngOnInit(): void {
    this.StatusLoading()

    this.MainService.getParcelas(this.user_id).subscribe(
      {
        next: (resp) => {
          console.log('Parcelas obtenidas:', resp);
          this.parcelas = resp.data
          console.log('parcelas:', this.parcelas)
          this.StatusLoading();
        },
        error: (err: HttpErrorResponse) => {
          this.StatusLoading();
          console.error('Error al obtener las parcelas', err);
        }
      }
    )
  }

  obtenervalor(e: string) {

    console.log('desde padre:', e)
  }

  StatusModal(e: boolean) {
    this.ModalActive = e
  }

  getParcela(e: string) {
    this.Nombre_parcela = e
    console.log('desde padre:', this.Nombre_parcela)
    this.ModalActive = false
    //enviando al backend la parcela creada
    const v = JSON.parse(JSON.stringify(this.Nombre_parcela))

    const obj = {
      nombre: v.nombre,
      ubicacion: this.objectGeom,
      user_id: this.user_id
    }

    console.log('objeto enviado al backend', obj)
    this.MainService.enviarParcela(obj).subscribe(
      {
        next: (res) => {
          console.log('respuesta del backend', res)
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



}
