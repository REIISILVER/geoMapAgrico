import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../barril/enviroments.prod';
import { Observable } from 'rxjs';
import { RegisteUser } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl =  enviroment.api+'/auth/';

  constructor() { }

  register_user(data: RegisteUser):Observable<any> {
    return this.http.post<any>(this.apiUrl+'register', data )
  }

  login_user(data: any):Observable<any>{
    return this.http.post<any>(this.apiUrl+'login', data)
  }

  logou_user(id:number):Observable<any>{
    const obj = {user_id : id}

    return this.http.post<any>(this.apiUrl+'logout',obj)
  }
}
