import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Journey} from "../model/journey.model";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {CrusoeRoute} from "../model/crosoe.route.model";
import {AlertController, ModalController} from "@ionic/angular";
import {RouteModalComponent} from "./route-modal/route-modal.component";
import {JourneyHighlightModalComponent} from "./journey-highlight-modal/journey-highlight-modal.component";
import {Highlight} from "../model/highlight.model";
import {filter} from "rxjs/operators";
import {Point} from '../model/point.model';
import {ColoredIcons} from '../map/colored-icons';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {

  public certainJourney: Journey = new Journey('-1', new Array<CrusoeRoute>(), 'N/A', '', new Array<string>(), '', true, null, null, new Array<Highlight>(), '')
  map: Leaflet.Map;
  markers: Leaflet.marker[][] = [];
  routeHighlights: Leaflet.marker[][] = [];
  journeyHighlights: Leaflet.marker[] = [];
  edges: Leaflet.polyline[] = [];
  pictureKey = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: JourneyStorageService,
    public modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        if (event.url.startsWith('/tabs/journeys/journey')) {
          this.storageService.readSingleJourney(this.route.snapshot.paramMap.get('id')).then(result => this.certainJourney = result);
        }
      });
    this.storageService.readSingleJourney(this.route.snapshot.paramMap.get('id')).then(result => this.certainJourney = result);
  }

  ionViewDidEnter() {
    const journey = this.certainJourney;
    this.leafletMap(journey.routes[0].points);
    this.setNodesAndEdgesAndHighlights(journey);
  }

  async routeBackToJourneyOverview() {
    await this.router.navigateByUrl('tabs/journeys');
  }

  async routeToCrusoeRoute(index: number) {
    await this.router.navigate(['tabs', 'journeys', 'journey', this.route.snapshot.paramMap.get('id'), 'route', index])
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

  async newHighlight() {
    await this.storageService.readSingleJourney(this.route.snapshot.paramMap.get('id')).then(result => this.certainJourney = result);
    const modal = await this.modalController.create({
      component: JourneyHighlightModalComponent,
      componentProps: {
        'journey': this.certainJourney
      }
    });
    modal.onDidDismiss().then(() => {
      this.addNewHighlightToMap(this.certainJourney.highlights[this.certainJourney.highlights.length - 1],
        -1, 7);
    });
    return await modal.present();
  }

  convertToReadableDate(dateNumber: number): string {
    return new Date(dateNumber).toLocaleString();
  }

  tagStyle(tag: string): string {
    return 'width: ' + tag.length * 15 + 'px;';
  }

  async deleteJourneyAlert() {
    const alert = await this.alertController.create({
      header: 'Reise löschen',
      message: 'Möchtest du die Reise wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: async () => {
            await this.deleteJourney();
          }
        },
        'Abbrechen'
      ]
    });
    await alert.present();
  }

  async deleteJourney() {
    await this.storageService.delete(this.certainJourney.key);
    await this.routeBackToJourneyOverview();
  }

  async deleteJourneyHighlightAlert(highlight: Highlight) {
    const alert = await this.alertController.create({
      header: 'Highlight löschen',
      message: 'Möchtest du das Highlight wirklich löschen?',
      buttons: [
        {
          text: 'Löschen',
          handler: async () => {
            await this.deleteJourneyHighlight(highlight);
          }
        },
        'Abbrechen'
      ]
    });
    await alert.present();
  }

  private async deleteJourneyHighlight(highlight: Highlight) {
    this.certainJourney.highlights = this.certainJourney.highlights.filter(h => h != highlight);
    await this.storageService.update(this.certainJourney.key, this.certainJourney);
    this.removeJourneyHighlightFromMap(highlight);
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
    this.map = new Leaflet.Map('journeyMap').setView([lat, long], zoomlevel);
    const layer = new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a>'
    });
    this.map.addLayer(layer);
  }

  setNodesAndEdgesAndHighlights(journey) {
    this.addJourneyHighlightsToMap(journey);
    journey.routes.forEach((route, routeIndex) => {
      this.addRouteToMap(route, routeIndex);
    });
  }

  addJourneyHighlightsToMap(journey){
    journey.highlights.forEach((highlight) => {
      this.addNewHighlightToMap(highlight, -1, 7);
    });
  }

  addRouteToMap(route, routeIndex){
    this.markers.splice(routeIndex, 0, []);
    this.routeHighlights.splice(routeIndex, 0, []);
    const sortedPoints = route.points.sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1);
    sortedPoints.forEach((point) => {
      this.addNewNodeToMap(point, routeIndex);
    });
    route.highlights.forEach((highlight) => {
      this.addNewHighlightToMap(highlight, routeIndex, 8);
    });
    this.addNewEdgeToMap(sortedPoints, routeIndex);
  }

  addNewNodeToMap(point, routeIndex){
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
    this.markers[routeIndex].push(actualMarker);
  }

  addNewEdgeToMap(sortedPoints: Point[], routeIndex) {
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
    this.edges.splice(routeIndex, 0, sortedPoints);
  }

  addNewHighlightToMap(highlight, routeIndex, colorIndex){
    this.pictureKey = 0;
    let image = '';
    if (highlight.pictures.length > 0) {
      image = '<img id="imageView" src="' + highlight.pictures[this.pictureKey].path + '" alt="Bilder des Nutzers zum Highlight" (swipe)="swipeEvent($event, highlight)" width="100%"/>';
    }
    const latlng = Leaflet.latLng(highlight.latitude, highlight.longitude);
    const actualMarker = new Leaflet.Marker(latlng,
      {icon: ColoredIcons.getColoredIconByIndex(colorIndex)}
    );
    actualMarker.bindPopup(
      image + '<br>' +
      '<b>' + highlight.headline + '</b>' + '<br> <br>' +
      highlight.description + '<br> <br>' +
      '<span>Tags: </span>' + highlight.tags.toString() + '<br>' +
      '<span>Zeitpunkt: </span>' + new Date(highlight.timestamp).toLocaleTimeString('de-DE') + '<br>' +
      '<span>Breitengrad: </span>' + highlight.latitude + '<br>' +
      '<span>Höhengrad: </span>' + highlight.longitude + '<br>' +
      '<span>Höhe: </span>' + highlight.height
    );
    this.map.addLayer(actualMarker);
    if (routeIndex === -1){
      this.journeyHighlights.push(actualMarker);
    }
    else {
      this.routeHighlights[routeIndex].push(actualMarker);
    }
  }

  removeJourneyHighlightFromMap(highlight: Highlight){
    const highlightId = this.journeyHighlights.indexOf(this.journeyHighlights.find(p =>
      p.getLatLng().lng === highlight.longitude
      && p.getLatLng().lat === highlight.latitude));
    // highlightId is -1 if highlight is not found
    if (highlightId || highlightId === 0){
      this.map.removeLayer(this.journeyHighlights[highlightId]);
      this.journeyHighlights.splice(highlightId, 1);
    }
    else {
      console.log('Could not find a matching journey highlight marker');
    }
  }

  removeNodeFromMap(point: Point, routeIndex){
    const markerId = this.markers[routeIndex].indexOf(this.markers[routeIndex].find(p =>
      p.getLatLng().lng === point.longitude
      && p.getLatLng().lat === point.latitude));
    if (markerId || markerId === 0){
      this.map.removeLayer(this.markers[routeIndex][markerId]);
      this.markers[routeIndex].splice(markerId, 1);
    }
  }

  redrawEdge(route, routeIndex){
    if (this.edges[routeIndex]){
      this.map.removeLayer(this.edges[routeIndex]);
      const sortedPoints = route.points.sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1);
      this.addNewEdgeToMap(sortedPoints, routeIndex);
    }
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave(){
    this.map.remove();
  }
}
