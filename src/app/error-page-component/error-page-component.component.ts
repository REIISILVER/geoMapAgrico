import { Component, inject, input, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { ErrorInfo } from './interface/error.interface';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-error-page-component',
  imports: [RouterLink],
  providers: [],
  templateUrl: './error-page-component.component.html',
  styleUrl: './error-page-component.component.css'
})
export class ErrorPageComponentComponent implements OnInit{

  public errorCode:WritableSignal<string> = signal('404');
  public snap = inject(Router);
  public errors  = {
    "404": {
      title: 'Página no encontrada',
      message: 'Lo sentimos, la página que buscas no existe.'
    },
    "500": {
      title: 'Error interno del servidor',
      message: 'Lo sentimos, algo salió mal en nuestro servidor.'
    },
    "403": {
      title: 'Acceso denegado',
      message: 'No tienes permiso para acceder a esta página. vuelve a iniciar sesión. si el problema persiste contacta con el administrador.'
    },
    "401": {
      title: 'No autorizado',
      message: 'No estás autorizado para ver esta página. Por favor, inicia sesión.'
    }
  }

  ngOnInit(): void {

    this.errorCode.set(this.snap.url.split('/').pop() || '404');
  }
}
