import {JourneyStorageService} from '../service/services/journey.storage.service';
import {Component, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {ColoredIcons} from './colored-icons';
import {Journey} from '../model/journey.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
/***
 * https://edupala.com/how-to-add-leaflet-map-in-ionic/
 ***/
export class MapPage implements OnInit {

  journeys: Journey[] = [];
  map: Leaflet.Map;
  pictureKey = 0;

  constructor(private storageService: JourneyStorageService) {
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.storageService.read().then(result => {
      this.journeys = result;
      this.leafletMap();
      this.setNodesAndEdgesJourney();
    }).catch((error) => {
      console.log(error);
    });
  }

  leafletMap() {
    let lat = 48.442078;
    let long = 8.684851;
    let zoomlevel = 5;
    if (this.journeys[0]) {
      if (this.journeys[0].routes[0]) {
        if (this.journeys[0].routes[0].points[0]) {
          lat = this.journeys[0].routes[0].points[0].latitude;
          long = this.journeys[0].routes[0].points[0].longitude;
          zoomlevel = 13;
        }
      }
    }
    this.map = new Leaflet.Map('mapId').setView([lat, long], zoomlevel);
    const layer = new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a>'
    });
    this.map.addLayer(layer);
  }

  setNodesAndEdgesJourney() {
    let index = 0;
    let colorIndex = 0;

    while (index < this.journeys.length) {
      this.journeys[index].routes.forEach((route) => this.setNodesAndEdgesRoute(route, colorIndex));
      this.journeys[index].highlights.forEach((highlight) => {
        this.addNewHighlightToMap(highlight, 7);
      });
      index++;
      if (colorIndex < 7) {
        colorIndex++;
      } else {
        colorIndex = 0;
      }
    }
  }

  setNodesAndEdgesRoute(route, colorIndex?) {
    if (colorIndex == null){
      colorIndex = 0;
    }
    const sortedPoints = route.points.sort((a, b) => a.timestamp < b.timestamp ? -1 : 1);
    const coordinates = [];

    sortedPoints.forEach((point) => {
      coordinates.push([point.latitude, point.longitude]);
      Leaflet.marker([point.latitude, point.longitude], {icon: ColoredIcons.getColoredIconByIndex(colorIndex)}).addTo(this.map)
        .bindPopup(
          '<span>Zeitpunkt: </span>' + new Date(point.timestamp).toLocaleDateString('de-DE') + '<br>' +
          '<span>Breitengrad: </span>' + point.latitude.toString() + '<br>' +
          '<span>Höhengrad: </span>' + point.longitude.toString() + '<br>' +
          '<span>Höhe: </span>' + point.height
        )
        .openPopup();
    });

    Leaflet.polyline(coordinates, {
      color: ColoredIcons.getColorByIndex(colorIndex),
      width: 10,
    }).addTo(this.map);

    route.highlights.forEach((highlight) => {
      this.addNewHighlightToMap(highlight, 8);
    });
  }

  addNewHighlightToMap(highlight, colorIndex){
    this.pictureKey = 0;
    let image = '';
    if (highlight.pictures.length > 0) {
      image = '<img id="imageView" src="' + highlight.pictures[this.pictureKey].path + '" alt="Bilder des Nutzers zum Highlight" (swipe)="swipeEvent($event, highlight)" width="100%"/>';
    }

    Leaflet.marker([highlight.latitude, highlight.longitude], {icon: ColoredIcons.getColoredIconByIndex(colorIndex)}).addTo(this.map)
      .bindPopup(
        image + '<br>' +
        '<b>' + highlight.headline + '</b>' + '<br> <br>' +
        highlight.description + '<br> <br>' +
        '<span>Tags: </span>' + highlight.tags.toString() + '<br>' +
        '<span>Zeitpunkt: </span>' + new Date(highlight.timestamp).toLocaleTimeString('de-DE') + '<br>' +
        '<span>Breitengrad: </span>' + highlight.latitude.toString() + '<br>' +
        '<span>Höhengrad: </span>' + highlight.longitude.toString() + '<br>' +
        '<span>Höhe: </span>' + highlight.height
      )
      .openPopup();
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave(){
    this.map.remove();
  }
}
