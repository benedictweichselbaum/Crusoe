import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {ColoredIcons} from '../map/colored-icons';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit, OnDestroy {

  public currentJourney: Journey = new Journey('-1', new Array<CrusoeRoute>(), 'N/A', null, null, '', true, null, null, null, null);
  public currentRoute: CrusoeRoute = new CrusoeRoute(-1, new Array<Point>(), new Array<Highlight>(), '', '', new Array<string>(), '', null, null);
  map: Leaflet.Map;
  pictureKey = 0;

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

  ionViewDidEnter() {
    // todo: change to real route
    const route = this.currentRoute;
    const lat = route.points[0].latitude;
    const long = route.points[0].longitude;
    const zoomlevel = 13;
    this.leafletMap(lat, long, zoomlevel);
    this.setNodesAndEdges(route);
    this.setHighlightsInMap(route);
  }

  routeBackToJourney() {
    this.router.navigate(['tabs', 'journeys', 'journey', this.route.snapshot.paramMap.get('id')])
  }

  async addNewPoint() {
    const position: Geoposition = await this.geolocationService.getCurrentGeolocation();
    const point = new Point(position.coords.latitude, position.coords.longitude, position.coords.altitude, Date.now());
    this.currentRoute.points.push(point);
    await this.storageService.update(this.currentJourney.key, this.currentJourney);
    this.addLastNodeToMap(this.currentRoute.points);
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

  leafletMap(lat, long, zoomlevel) {
    this.map = Leaflet.map('routeMap').setView([lat, long], zoomlevel);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a>'
    }).addTo(this.map);
  }

  setNodesAndEdges(route) {
    const sortedPoints = route.points.sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1);
    const coordinates = [];

    sortedPoints.forEach((point) => {
      coordinates.push([point.latitude, point.longitude]);
      Leaflet.marker([point.latitude, point.longitude], {icon: ColoredIcons.getColoredIconByIndex(0)}).addTo(this.map)
        .bindPopup(
          '<span>Zeitpunkt: </span>' + new Date(point.timestamp).toLocaleDateString('de-DE') + '<br>' +
          '<span>Breitengrad: </span>' + point.latitude.toString() + '<br>' +
          '<span>Höhengrad: </span>' + point.longitude.toString() + '<br>' +
          '<span>Höhe: </span>' + point.height
        );
    });

    Leaflet.polyline(coordinates, {
      color: ColoredIcons.getColorByIndex(0),
      width: 10,
    }).addTo(this.map);
  }

  addLastNodeToMap(points){
    const sortedPoints = points.sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1);
    const lastPoint = sortedPoints[sortedPoints.length - 1];
    Leaflet.marker([lastPoint.latitude, lastPoint.longitude], {icon: ColoredIcons.getColoredIconByIndex(0)}).addTo(this.map)
      .bindPopup(
        '<span>Zeitpunkt: </span>' + new Date(lastPoint.timestamp).toLocaleDateString('de-DE') + '<br>' +
        '<span>Breitengrad: </span>' + lastPoint.latitude.toString() + '<br>' +
        '<span>Höhengrad: </span>' + lastPoint.longitude.toString() + '<br>' +
        '<span>Höhe: </span>' + lastPoint.height
      );
    const coordinates = [];
    coordinates.push([sortedPoints[sortedPoints.length - 2].latitude, sortedPoints[sortedPoints.length - 2].longitude]);
    coordinates.push([lastPoint.latitude, lastPoint.longitude]);
    Leaflet.polyline(coordinates, {
      color: ColoredIcons.getColorByIndex(0),
      width: 10,
    }).addTo(this.map);
  }

  setHighlightsInMap(route){
    route.highlights.forEach((highlight) => {
      this.setHighlightInMap(highlight);
    });
  }

  setHighlightInMap(highlight){
    this.pictureKey = 0;
    let image = '';
    if (highlight.pictures.length > 0) {
      image = '<img id="imageView" src="' + highlight.pictures[this.pictureKey].path + '" alt="Bilder des Nutzers zum Highlight" (swipe)="swipeEvent($event, highlight)" width="100%"/>';
    }

    Leaflet.marker([highlight.latitude, highlight.longitude], {icon: ColoredIcons.getColoredIconByIndex(8)}).addTo(this.map)
      .bindPopup(
        image + '<br>' +
        '<b>' + highlight.headline + '</b>' + '<br> <br>' +
        highlight.description + '<br> <br>' +
        '<span>Tags: </span>' + highlight.tags.toString() + '<br>' +
        '<span>Zeitpunkt: </span>' + new Date(highlight.timestamp).toLocaleTimeString('de-DE') + '<br>' +
        '<span>Breitengrad: </span>' + highlight.latitude.toString() + '<br>' +
        '<span>Höhengrad: </span>' + highlight.longitude.toString() + '<br>' +
        '<span>Höhe: </span>' + highlight.height
      );
    // todo: Informationen, die angezeigt werden überarbeiten
    /*if (highlight.pictures.length > 0) {
    //listener funktioniert noch nicht
      document.getElementById('imageView').addEventListener('swipe')
    }*/
  }

  swipeEvent(event, highlight: Highlight) {
    if (event.direction === 2 && this.pictureKey < highlight.pictures.length) {
      this.pictureKey++;
      const myImg = document.getElementById('imageView') as HTMLImageElement;
      myImg.src = highlight.pictures[this.pictureKey].path;
    }
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }
}
