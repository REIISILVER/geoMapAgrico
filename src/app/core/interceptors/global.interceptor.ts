import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') != undefined ? localStorage.getItem('token') : false;
  if (token) {
    const headers = req.clone(
      {
        setHeaders: {
          'Authorization': 'Bearer ' + token.split('|')[1]
        }
      }
    );
    return next(headers).pipe(
      tap(() => { })
    );
  }


  return next(req);
};
