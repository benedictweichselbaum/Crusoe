import { Component, OnInit } from '@angular/core';
import {CrusoeRoute} from "../model/crosoe.route.model";
import {Point} from "../model/point.model";
import {Highlight} from "../model/highlight.model";
import {ActivatedRoute, Router} from "@angular/router";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {Journey} from "../model/journey.model";
import {Geolocation} from "@ionic-native/geolocation/ngx";

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
    private geolocation: Geolocation
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

  addNewPoint() {
    let longitude = 0;
    let latitude = 0;
    let height = 0;
    this.geolocation.getCurrentPosition().then(response => {
      console.log(response.coords.latitude)
      longitude = response.coords.longitude;
      latitude = response.coords.latitude;
      height = response.coords.altitude;
      this.currentRoute.points.push(new Point(latitude, longitude, height, Date.now()));
      this.storageService.update(this.currentJourney.key, this.currentJourney);
    });
  }
}
