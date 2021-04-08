import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicStorageModule} from "@ionic/storage-angular";
import {JourneyStorageService} from "./journey.storage.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicStorageModule.forRoot()
  ],
  providers: [JourneyStorageService]
})
export class CrusoeServicesModule { }
