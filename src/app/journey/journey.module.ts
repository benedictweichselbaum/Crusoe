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
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import { File } from '@ionic-native/file/ngx';


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
  providers: [Geolocation, SocialSharing, File]
})
export class JourneyComponentModule {}
