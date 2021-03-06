import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JourneysPage } from './journeys.page';
import {JourneyComponent} from "../journey/journey.component";

const routes: Routes = [
  {
    path: '',
    component: JourneysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JourneysPageRoutingModule {}
