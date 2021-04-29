import {Component, OnInit} from '@angular/core';
import {CrusoeRoute} from "../model/crosoe.route.model";
import {Point} from "../model/point.model";
import {Highlight} from "../model/highlight.model";
import {ActivatedRoute, Router} from "@angular/router";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {Journey} from "../model/journey.model";
import {Geoposition} from "@ionic-native/geolocation/ngx";
import {AlertController, ModalController} from "@ionic/angular";
import {RouteHighlightModalComponent} from './route-highlight-modal/route-highlight-modal.component';
import {CrusoeGeolocationService} from "../service/services/crusoe-geolocation.service";
import {ColoredIcons} from '../map/colored-icons';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit {

  public currentJourney: Journey = new Journey('-1', new Array<CrusoeRoute>(), 'N/A', null, null, '', true, null, null, null, null);
  public currentRoute: CrusoeRoute = new CrusoeRoute(-1, new Array<Point>(), new Array<Highlight>(), '', '', new Array<string>(), '', null, null);
  map: Leaflet.Map;
  markers: Leaflet.marker = [];
  highlights: Leaflet.marker = [];
  edge: Leaflet.polyline;
  pictureKey = 0;

  constructor(
    private router: Router,
    private storageService: JourneyStorageService,
    private route: ActivatedRoute,
    public geolocationService: CrusoeGeolocationService,
    public modalController: ModalController,
    private alertController: AlertController
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
    const route = this.currentRoute;
    this.leafletMap(route.points);
    this.setNodesAndEdgesAndHighlights(route);
  }

  async routeBackToJourney() {
    await this.router.navigate(['tabs', 'journeys', 'journey', this.route.snapshot.paramMap.get('id')])
  }

  async addNewPoint() {
    const position: Geoposition = await this.geolocationService.getCurrentGeolocation();
    const point = new Point(position.coords.latitude, position.coords.longitude, position.coords.altitude, Date.now());
    this.currentRoute.points.push(point);
    await this.storageService.update(this.currentJourney.key, this.currentJourney);
    this.addNewNodeToMap(point);
    this.redrawEdge();
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
    modal.onDidDismiss().then(() => {
      this.addNewHighlightToMap(this.currentRoute.highlights[this.currentRoute.highlights.length - 1]);
    });
    return modal.present();
  }



  tagStyle(tag: string): string {
    return 'width: ' + tag.length * 15 + 'px;';
  }

  async deleteRouteAlert() {
    const alert = await this.alertController.create({
      header: 'Route löschen',
      message: 'Möchtest du die Route wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: async () => {
            await this.deleteRoute();
          }
        },
        'Abbrechen'
      ]
    });
    await alert.present();
  }

  async deleteRoute() {
    this.currentJourney.routes = this.currentJourney.routes.filter(r => r != this.currentRoute);
    await this.storageService.update(this.currentJourney.key, this.currentJourney);
    await this.routeBackToJourney();
  }

  async deleteRouteHighlightAlert(highlight: Highlight) {
    const alert = await this.alertController.create({
      header: 'Highlight löschen',
      message: 'Möchtest du das Highlight wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: async () => {
            await this.deleteRouteHighlight(highlight);
          }
        },
        'Abbrechen'
      ]
    });
    await alert.present();
  }

  async deleteRoutePointAlert(point: Point) {
    const alert = await this.alertController.create({
      header: 'Routen-Punkt löschen',
      message: 'Möchtest du den Routenpunkt wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: async () => {
            await this.deleteRoutePoint(point);
          }
        },
        'Abbrechen'
      ]
    });
    await alert.present();
  }

  private async deleteRoutePoint(point: Point) {
    this.currentRoute.points = this.currentRoute.points.filter(p => p != point);
    this.removeNodeFromMap(point);
    this.redrawEdge();
    await this.storageService.update(this.currentJourney.key, this.currentJourney);
  }

  private async deleteRouteHighlight(highlight: Highlight) {
    this.currentRoute.highlights = this.currentRoute.highlights.filter(h => h != highlight);
    this.removeHighlightFromMap(highlight);
    await this.storageService.update(this.currentJourney.key, this.currentJourney);
  }

  /***
  * section with map code
  ***/

  leafletMap(points: Point[]) {
    let lat = 48.442078;
    let long = 8.684851;
    let zoomlevel = 3;
    if (points[0]) {
      lat = points[0].latitude;
      long = points[0].longitude;
      zoomlevel = 13;
    }
    this.map = new Leaflet.Map('routeMap').setView([lat, long], zoomlevel);
    const layer = new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a>'
    });
    this.map.addLayer(layer);
  }

  setNodesAndEdgesAndHighlights(route) {
    const sortedPoints = route.points.sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1);
    sortedPoints.forEach((point) => {
      this.addNewNodeToMap(point);
    });
    route.highlights.forEach((highlight) => {
      this.addNewHighlightToMap(highlight);
    });
    this.addNewEdgeToMap(sortedPoints);
  }

  addNewNodeToMap(point){
    const actualMarker = new Leaflet.Marker(
      new Leaflet.LatLng(point.latitude, point.longitude), {icon: ColoredIcons.getColoredIconByIndex(0)}
    );
    actualMarker.bindPopup(
      '<span>Zeitpunkt: </span>' + new Date(point.timestamp).toLocaleDateString('de-DE') + '<br>' +
      '<span>Breitengrad: </span>' + point.latitude.toString() + '<br>' +
      '<span>Höhengrad: </span>' + point.longitude.toString() + '<br>' +
      '<span>Höhe: </span>' + point.height
    );
    this.map.addLayer(actualMarker);
    this.markers.push(actualMarker);
  }

  addNewEdgeToMap(sortedPoints: Point[]) {
    const coordinates = [];
    for (let i = 0; i < sortedPoints.length - 1; i++){
      coordinates.push([sortedPoints[i].latitude, sortedPoints[i].longitude]);
      coordinates.push([sortedPoints[i + 1].latitude, sortedPoints[i + 1].longitude]);
    }
    const edge = Leaflet.polyline(coordinates, {
      color: ColoredIcons.getColorByIndex(0),
      width: 10,
    });
    this.map.addLayer(edge);
    this.edge = edge;
  }

  addNewHighlightToMap(highlight){
    this.pictureKey = 0;
    let image = '';
    if (highlight.pictures.length > 0) {
      image = '<img id="imageView" src="' + highlight.pictures[this.pictureKey].path + '" alt="Bilder des Nutzers zum Highlight" (swipe)="swipeEvent($event, highlight)" width="100%"/>';
    }
    const actualMarker = new Leaflet.Marker(
      new Leaflet.LatLng(highlight.latitude, highlight.longitude), {icon: ColoredIcons.getColoredIconByIndex(8)}
    );
    actualMarker.bindPopup(
      image + '<br>' +
      '<b>' + highlight.headline + '</b>' + '<br> <br>' +
      highlight.description + '<br> <br>' +
      '<span>Tags: </span>' + highlight.tags.toString() + '<br>' +
      '<span>Zeitpunkt: </span>' + new Date(highlight.timestamp).toLocaleTimeString('de-DE') + '<br>' +
      '<span>Breitengrad: </span>' + highlight.latitude.toString() + '<br>' +
      '<span>Höhengrad: </span>' + highlight.longitude.toString() + '<br>' +
      '<span>Höhe: </span>' + highlight.height
    );
    this.map.addLayer(actualMarker);
    this.highlights.push(actualMarker);
  }


  removeHighlightFromMap(highlight: Highlight){
    const highlightId = this.highlights.indexOf(this.highlights.find(p => p.getLatLng().lng === highlight.longitude
      && p.getLatLng().lat === highlight.latitude));
    if (highlightId || highlightId === 0){
      this.map.removeLayer(this.highlights[highlightId]);
      this.highlights.splice(highlightId, 1);
    }
  }


  removeNodeFromMap(point: Point){
    const markerId = this.markers.indexOf(this.markers.find(p => p.getLatLng().lng === point.longitude
      && p.getLatLng().lat === point.latitude));
    if (markerId || markerId === 0){
      this.map.removeLayer(this.markers[markerId]);
      this.markers.splice(markerId, 1);
    }
  }

  redrawEdge(){
    if (this.edge){
      this.map.removeLayer(this.edge);
      const sortedPoints = this.currentRoute.points.sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1);
      this.addNewEdgeToMap(sortedPoints);
    }
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave(){
    this.map.remove();
  }
}
