import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../barril/enviroments.prod';
import { CultivosByID, cultivosGetResponse, CultivosToSend } from '../interfaces/cultivos.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CultivosService {

  private http = inject(HttpClient);
  private api = enviroment.api+'/cultivo';


  constructor() { }

  guardarCultivo(obj: CultivosToSend): Observable<any>{
    return this.http.post(this.api+'/agregar',obj);
  }

  obtenerCultivos(parcela_id: number): Observable<cultivosGetResponse>{
    return this.http.get<cultivosGetResponse>(this.api+'/get/'+parcela_id);
  }

  updateCultivo(obj: any, cultivo_id:number): Observable<any>{
    return this.http.put(this.api+'/update/'+cultivo_id,obj);
  }

  obteneCultivoPorId(cultivo_id: number) :Observable<CultivosByID []>{
    return this.http.get<CultivosByID []>(this.api+'/getcultivo/'+cultivo_id);
  }

  eliminarCultivo(cultivo_id:number): Observable<any>{
    return this.http.delete(this.api+'/delete/'+cultivo_id);
  }
}
