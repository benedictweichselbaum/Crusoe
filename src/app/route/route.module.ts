import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {CrusoeServicesModule} from "../service/services/crusoe-services.module";
import {RouteComponent} from "./route.component";
import {RouteComponentRoutingModule} from "./route-routing.module";
import {Geolocation} from "@ionic-native/geolocation/ngx";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouteComponentRoutingModule,
    CrusoeServicesModule
  ],
  declarations: [RouteComponent],
  providers: [Geolocation]
})
export class RouteComponentModule {}
