import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {JourneyComponentRoutingModule} from "./journey-routing.module";
import {JourneyComponent} from "./journey.component";
import {CrusoeServicesModule} from "../service/services/crusoe-services.module";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    JourneyComponentRoutingModule,
    CrusoeServicesModule
  ],
  declarations: [JourneyComponent]
})
export class JourneyComponentModule {}
