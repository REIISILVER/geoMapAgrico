import { Injectable, inject } from '@angular/core';
import { enviroment } from '../../../barril/enviroments.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActividadesByCultivo, CreateActividad } from '../interfaces/actividades.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private url = enviroment.api+'/actividades';
  private http = inject(HttpClient);

  constructor() { }

  sendActividad(obj: CreateActividad):Observable<any>{
    return this.http.post<any>(this.url+'/agregar', obj)
  }
  getActividades(cultivo_id: number):Observable<ActividadesByCultivo []>{
    return this.http.get<ActividadesByCultivo []>(this.url+'/getActividades/'+cultivo_id)
  }

  deleteActividad(actividad_id:number):Observable<any>{
    return this.http.delete<any>(this.url+'/delete/'+actividad_id)
  }
  updateActividad(obj: any, actividad_id:number):Observable<any>{
    return this.http.put<any>(this.url+'/update/'+actividad_id,obj)
  }
}
