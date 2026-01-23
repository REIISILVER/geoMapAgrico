import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, } from '@angular/router';

import { RenderMode } from '@angular/ssr';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/page/base/base.component').then(m => m.BaseComponent),
    children: [
      {
        path: 'register',
        loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'main',
    loadComponent: () => import('./main/main.component').then(m => m.MainComponent),

    children: [
      {
        path: 'home',
        loadComponent: () => import('./main/pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'cultivo/:id',
        loadComponent: () => import('./main/pages/admin-cultivo/admin-cultivo.component').then(m => m.AdminCultivoComponent),
        data: {
          renderMode: RenderMode.Server

        }
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },
  {
    path:'error/:code',
    loadComponent: () => import('./error-page-component/error-page-component.component').then(m => m.ErrorPageComponentComponent),

  },
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];



// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes, withPrerendering(  // Aquí lo defines global o por ruta
//       (url: string) => {
//         if (url.startsWith('/main/cultivo/')) {
//           const id = url.split('/').pop();  // Extrae :id
//           if (id && ['1', '2', '3'].includes(id)) {  // Ejemplos: prerenderiza /cultivo/1, /2, /3
//             return true;
//           }
//         }
//         return false;
//       },
//       {
//         routes: '/main/cultivo/:id',  // Especifica la ruta
//         getPrerenderParams: () => [  // Función que retorna params de ejemplo
//           { id: '1' },  // Prerenderiza /main/cultivo/1
//           { id: '2' },  // /main/cultivo/2
//           { id: '3' },  // Agrega más si quieres
//         ],
//       },

//     )),
//     // Otros providers...
//   ],
// };

// function withPrerendering(arg0: (url: string) => boolean, arg1: {
//   routes: string; // Especifica la ruta
//   getPrerenderParams: () => { id: string; }[];
// }): import("@angular/router").RouterFeatures {
//   throw new Error('Function not implemented.');
// }
