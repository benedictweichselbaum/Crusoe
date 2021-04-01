import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JourneysPage } from './journeys.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { JourneysPageRoutingModule } from './journeys-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    JourneysPageRoutingModule
  ],
  declarations: [JourneysPage]
})
export class JourneysPageModule {}
