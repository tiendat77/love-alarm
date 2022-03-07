import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [],
  exports: [
    FormsModule,
    HttpClientModule,

    ComponentsModule,
    DirectivesModule,
  ],
  providers: [],
  declarations: [],
})
export class SharedModule {}
