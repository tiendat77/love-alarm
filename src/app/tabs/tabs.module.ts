import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { HomePageModule } from '../pages/home/home.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { DiscoverPageModule } from '../pages/discover/discover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageModule,
    ProfilePageModule,
    DiscoverPageModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage
  ]
})
export class TabsPageModule {}
