import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {JourneyComponentRoutingModule} from "./journey-routing.module";
import {JourneyComponent} from "./journey.component";
import {CrusoeServicesModule} from "../service/services/crusoe-services.module";
import {RouteComponent} from "../route/route.component";
import {RouteModalComponent} from "./route-modal/route-modal.component";
import {Geolocation} from "@capacitor/core";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    JourneyComponentRoutingModule,
    CrusoeServicesModule,
    ReactiveFormsModule
  ],
  declarations: [JourneyComponent, RouteModalComponent]
})
export class JourneyComponentModule {}
