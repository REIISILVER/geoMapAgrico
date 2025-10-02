import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../barril/enviroments.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {

  private http = inject(HttpClient);
  private url = enviroment.api+'/recursos/'

  constructor() { }

  crearRecurso(obj: any):Observable<any>{
    return this.http.post<any>(this.url+'agregar',obj)
  }

  getRecursos(id_cultivo: number):Observable<any>{
    return this.http.get(this.url+'getRecursos/'+id_cultivo)
  }

  updateRecursos(obj: any, id:number):Observable<any>{
    return this.http.put<any>(this.url+'update/'+id, obj)
  }

  deleteRecurso(id_recursos:number):Observable<any>{
    return this.http.delete<any>(this.url+'delete/'+id_recursos)
  }
}
