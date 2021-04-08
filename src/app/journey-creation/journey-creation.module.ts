import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {CrusoeServicesModule} from "../service/services/crusoe-services.module";
import {JourneyCreationComponent} from "./journey-creation.component";
import {JourneyCreationComponentRoutingModule} from "./journey-creation-routing.module";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    JourneyCreationComponentRoutingModule,
    CrusoeServicesModule
  ],
  declarations: [JourneyCreationComponent]
})
export class JourneyCreationComponentModule {}
