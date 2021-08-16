import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { HomePageModule } from '../pages/home/home.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { HistoryPageModule } from '../pages/history/history.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageModule,
    ProfilePageModule,
    HistoryPageModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage
  ]
})
export class TabsPageModule {}
