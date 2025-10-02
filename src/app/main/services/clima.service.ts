import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../barril/enviroments.prod';
import { CurrentWeather } from '../interfaces/clima.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
private http = inject(HttpClient);
private url = enviroment.api_clima;
private url_2_parte = enviroment.api_clima2;
// //latitude=52.52&longitude=13.41
  constructor() { }

  getCurrentWeather(latitud: any, longitud: any):Observable<CurrentWeather>{
    return this.http.get<CurrentWeather>(this.url+'latitude='+latitud+'&longitude='+longitud+this.url_2_parte)

  }
}
