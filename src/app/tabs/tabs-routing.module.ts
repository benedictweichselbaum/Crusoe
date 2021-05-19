import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'journeys',
        children: [
          {
            path: '',
            loadChildren: () => import('../journeys/journeys.module').then(m => m.JourneysPageModule)
          },
          {
            path: 'journey/:id',
            loadChildren: () => import('../journey/journey.module').then(m => m.JourneyComponentModule)
          },
          {
            path: 'new',
            loadChildren: () => import('../journey-creation/journey-creation.module').then(m => m.JourneyCreationComponentModule)
          },
          {
            path: 'import',
            loadChildren: () => import('../journey-import/journey-import.module').then(m => m.JourneyImportComponentModule)
          },
          {
            path: 'journey/:id/route/:index',
            loadChildren: () => import('../route/route.module').then(m => m.RouteComponentModule)
          }
        ]
      },
      {
        path: 'map',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('../analytics/analytics.module').then(m => m.AnalyticsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/journeys',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/journeys',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
