import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../barril/enviroments.prod';
import { Observable } from 'rxjs';
import { HttpParcelas } from '../interfaces/parcelas.interfaces';
import { updateParcela } from '../interfaces/draw.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {
  private http = inject(HttpClient);
  private api = enviroment.api;
  constructor() { }

  enviarParcela(parcela: any):Observable<any>{
    return this.http.post(this.api+'/parcela/guardar',parcela)
  }

  getParcelas(id: number):Observable<HttpParcelas>{
    return this.http.get<HttpParcelas>(this.api+'/parcela/getParcelas/'+id)
  }

  updateParcela(obj: updateParcela):Observable<any>{
    return this.http.put(this.api+'/parcela/update',obj)
  }

  DeleteParcela(id: number):Observable<any>{
    return this.http.delete(this.api+'/parcela/delete/'+id)
  }
}
