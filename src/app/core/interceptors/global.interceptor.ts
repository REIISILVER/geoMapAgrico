import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') != undefined ? localStorage.getItem('token') : false;
  const ruta = inject(Router);
  if (token) {
    const headers = req.clone(
      {
        setHeaders: {
          'Authorization': 'Bearer ' + token.split('|')[1]
        }
      }
    );
    return next(headers).pipe(
      tap(() => console.log('request successful')),
      catchError((error: HttpErrorResponse) => {
       console.log('error capurado')

        switch(error.status){
          case 404:
            ruta.navigate(['/error'], { state: { errorCode: '404' } });
            break;
          case 500:
            ruta.navigate(['/error'], { state: { errorCode: '500' } });
            break;
          case 403:
            ruta.navigate(['/error'], { state: { errorCode: '403' } });
            break;
          case 401:
            ruta.navigate(['/error'], { state: { errorCode: '401' } });
            break;
        }
        return [];
      })
    );
  }


  return next(req).pipe(
      tap(() => console.log('request successful')),
      catchError((error: HttpErrorResponse) => {
       console.log('error capurado', error.status)

        switch(error.status){
          case 404:
            //en caso de que sea un proble de que no encontro un user en el login no redirijo a la pagina de error
            if(!req.url.includes('/auth/login')){
              ruta.navigate(['/error/',error.status]);
            }
            console.log('redireccionando 404 en login')
            return throwError(() => error);

          case 500:
            ruta.navigate(['/error/',error.status]);
            break;
          case 403:
            ruta.navigate(['/error/',error.status]);
            break;
          case 401:
            ruta.navigate(['/error/',error.status]);
            break;
        }
        return [];
      })
    );
};
