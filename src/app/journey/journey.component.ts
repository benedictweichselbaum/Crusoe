import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Journey} from "../model/journey.model";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {CrusoeRoute} from "../model/crosoe.route.model";
import {ModalController} from "@ionic/angular";
import {RouteModalComponent} from "./route-modal/route-modal.component";

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {

  public certainJourney: Journey = new Journey('-1', new Array<CrusoeRoute>(), 'N/A', null, null, '', true, null, null, null, null)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: JourneyStorageService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.storageService.readSingleJourney(this.route.snapshot.paramMap.get('id')).then(result => this.certainJourney = result);
  }

  routeBackToJourneyOverview() {
    this.router.navigateByUrl('tabs/journeys')
  }

  routeToCrusoeRoute(index: number) {
    this.router.navigate(['tabs', 'journeys', 'journey', this.route.snapshot.paramMap.get('id'), 'route', index])
  }

  async newRoute() {
    await this.storageService.readSingleJourney(this.route.snapshot.paramMap.get('id')).then(result => this.certainJourney = result);
    const modal = await this.modalController.create({
      component: RouteModalComponent,
      componentProps: {
        'journey': this.certainJourney
      }
    });
    return await modal.present();
  }

  newHighlight() {

  }
}
