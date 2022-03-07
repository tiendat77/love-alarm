import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TurorialPage } from './turorial.page';

const routes: Routes = [
  {
    path: '',
    component: TurorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TurorialPageRoutingModule {}
