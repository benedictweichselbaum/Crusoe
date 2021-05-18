import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JourneyComponentRoutingModule} from "./journey-routing.module";
import {JourneyComponent} from "./journey.component";
import {CrusoeServicesModule} from "../service/services/crusoe-services.module";
import {RouteModalComponent} from "./route-modal/route-modal.component";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {JourneyHighlightModalComponent} from "./journey-highlight-modal/journey-highlight-modal.component";
import {JourneyEditModalComponent} from "./journey-edit-modal/journey-edit-modal.component";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    JourneyComponentRoutingModule,
    CrusoeServicesModule,
    ReactiveFormsModule
  ],
  declarations: [JourneyComponent, RouteModalComponent, JourneyHighlightModalComponent, JourneyEditModalComponent],
  providers: [Geolocation]
})
export class JourneyComponentModule {}
