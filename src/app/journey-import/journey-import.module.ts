import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CrusoeServicesModule} from '../service/services/crusoe-services.module';
import {JourneyImportComponent} from './journey-import.component';
import {JourneyImportComponentRoutingModule} from './journey-import-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    JourneyImportComponentRoutingModule,
    CrusoeServicesModule,
    ReactiveFormsModule
  ],
  declarations: [JourneyImportComponent]
})
export class JourneyImportComponentModule {}
