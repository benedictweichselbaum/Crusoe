import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JourneyCreationComponent} from "./journey-creation.component";

const routes: Routes = [
  {
    path: '',
    component: JourneyCreationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JourneyCreationComponentRoutingModule {}
