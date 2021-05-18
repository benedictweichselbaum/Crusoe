import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CrusoeServicesModule} from "../service/services/crusoe-services.module";
import {JourneyCreationComponent} from "./journey-creation.component";
import {JourneyCreationComponentRoutingModule} from "./journey-creation-routing.module";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    JourneyCreationComponentRoutingModule,
    CrusoeServicesModule,
    ReactiveFormsModule
  ],
  declarations: [JourneyCreationComponent]
})
export class JourneyCreationComponentModule {}
