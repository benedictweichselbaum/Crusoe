import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JourneyImportComponent} from './journey-import.component';

const routes: Routes = [
  {
    path: '',
    component: JourneyImportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JourneyImportComponentRoutingModule {}
