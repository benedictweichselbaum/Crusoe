import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JourneysPage } from './journeys.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { JourneysPageRoutingModule } from './journeys-routing.module';
import {CrusoeServicesModule} from "../service/services/crusoe-services.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    JourneysPageRoutingModule,
    CrusoeServicesModule
  ],
  declarations: [JourneysPage],
  providers: []
})
export class JourneysPageModule {}
