import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CrusoeServicesModule} from "../service/services/crusoe-services.module";
import {RouteComponent} from "./route.component";
import {RouteComponentRoutingModule} from "./route-routing.module";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {RouteHighlightModalComponent} from "./route-highlight-modal/route-highlight-modal.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouteComponentRoutingModule,
    CrusoeServicesModule,
    ReactiveFormsModule
  ],
  declarations: [RouteComponent, RouteHighlightModalComponent],
  providers: [Geolocation]
})
export class RouteComponentModule {}
