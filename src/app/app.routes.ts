import { Routes } from '@angular/router';

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
    path:'main',
    loadComponent: () => import('./main/main.component').then(m => m.MainComponent),
    children: [
      {
        path:'home',
        loadComponent: () => import('./main/pages/home/home.component').then(m => m.HomeComponent)
      },
    ]
  },
  {
    path:'**',
    redirectTo: 'auth/login',
  }
];
