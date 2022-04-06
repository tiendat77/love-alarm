import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { TutorialGuard } from './guards/tutorial.guard';
import { ContainerComponent } from './components/container/container.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tutorial',
  },
  {
    path: 'app',
    component: ContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/app/home',
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'discover',
        loadChildren: () => import('./pages/discover/discover.module').then( m => m.DiscoverPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'tutorial',
    canLoad: [TutorialGuard],
    loadChildren: () => import('./pages/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: 'permissions',
    loadChildren: () => import('./pages/permissions/permissions.module').then( m => m.PermissionsPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
