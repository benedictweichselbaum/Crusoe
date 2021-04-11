import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicStorageModule} from "@ionic/storage-angular";
import {JourneyStorageService} from "./journey.storage.service";
import {CrusoeCameraService} from "./crusoe-camera.service";
import {CrusoeGeolocationService} from "./crusoe-geolocation.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicStorageModule.forRoot()
  ],
  providers: [JourneyStorageService, CrusoeCameraService, CrusoeGeolocationService]
})
export class CrusoeServicesModule { }
