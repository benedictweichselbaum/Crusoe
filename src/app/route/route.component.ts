import { Component, OnInit } from '@angular/core';
import {CrusoeRoute} from "../model/crosoe.route.model";
import {Point} from "../model/point.model";
import {Highlight} from "../model/highlight.model";
import {ActivatedRoute, Router} from "@angular/router";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {Journey} from "../model/journey.model";
import {Geolocation, Geoposition} from "@ionic-native/geolocation/ngx";
import {ModalController} from "@ionic/angular";
import {RouteHighlightModalComponent} from "./route-highlight-modal/route-highlight-modal.component";
import {CrusoeGeolocationService} from "../service/services/crusoe-geolocation.service";

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit {

  public currentJourney: Journey = new Journey('-1', new Array<CrusoeRoute>(), 'N/A', null, null, '', true, null, null, null, null);
  public currentRoute: CrusoeRoute = new CrusoeRoute(-1, new Array<Point>(), new Array<Highlight>(), '', '', new Array<string>(), '', null, null);

  constructor(
    private router: Router,
    private storageService: JourneyStorageService,
    private route: ActivatedRoute,
    public geolocationService: CrusoeGeolocationService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    const journeyId = this.route.snapshot.paramMap.get('id');
    const routeIndex = this.route.snapshot.paramMap.get('index');
    this.storageService.readSingleJourney(journeyId).then(result => {
      this.currentJourney = result;
      this.currentRoute = this.currentJourney.routes.find(route => route.index === Number(routeIndex));
    });
  }

  routeBackToJourney() {
    this.router.navigate(['tabs', 'journeys', 'journey', this.route.snapshot.paramMap.get('id')])
  }

  async addNewPoint() {
    const position: Geoposition = await this.geolocationService.getCurrentGeolocation();
    this.currentRoute.points.push(new Point(position.coords.latitude, position.coords.longitude, position.coords.altitude, Date.now()));
    await this.storageService.update(this.currentJourney.key, this.currentJourney);
  }

  convertToReadableDate(dateNumber: number): string {
    return new Date(dateNumber).toLocaleString();
  }

  async newHighlight() {
    await this.storageService.readSingleJourney(this.route.snapshot.paramMap.get('id')).then(result => this.currentJourney = result);
    const modal = await this.modalController.create({
      component: RouteHighlightModalComponent,
      componentProps: {
        'journey': this.currentJourney,
        'route': this.currentRoute
      }
    });
    return await modal.present();
  }
}
