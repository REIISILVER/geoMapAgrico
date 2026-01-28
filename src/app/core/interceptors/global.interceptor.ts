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
       console.log('error capurado',error.status)

        switch(error.status){
          case 404:
            if(!req.url.includes('/auth/login')){
              //ruta.navigate(['/error/',error.status]);
              console.log('redireccionando 404 fuera del  login')
            }
            return throwError(() => error);
            break;
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
  }


  return next(req).pipe(
      tap(() => console.log('request successful')),
      catchError((error: HttpErrorResponse) => {

       console.log('error capurado', error.status)

        switch(error.status){
          // case 404:
          //   //en caso de que sea un proble de que no encontro un user en el login no redirijo a la pagina de error
          //   if(!req.url.includes('/auth/login')){
          //     ruta.navigate(['/error/',error.status]);
          //   }
          //   console.log('redireccionando 404 en login')
          //   return throwError(() => error);

          case 500:
            ruta.navigate(['/error/',error.status]);
            break;
          case 403:
            ruta.navigate(['/error/',error.status]);
            break;
          case 401:
            ruta.navigate(['/error/',error.status]);
            break;

            default:
              console.log('no redirecciona ningun error')
              return throwError(() => error);
        }
        return [];
      })
    );
};
