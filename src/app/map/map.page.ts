import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {ColoredIcons} from './colored-icons';
import {JourneyStorageService} from '../service/services/journey.storage.service';
import {Journey} from '../model/journey.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
/***
 * https://edupala.com/how-to-add-leaflet-map-in-ionic/
 ***/
export class MapPage implements OnInit, OnDestroy {

  map: Leaflet.Map;
  pointsOnRoute = [];
  journeys: Journey[] = [];

  constructor(public journeyStorageService: JourneyStorageService) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.leafletMap();
    this.drawCrusoeRoute();
  }

  drawCrusoeRoute() {
    this.readInJourneys();
    this.setNodesAndEdgesWithColor();
  }

  leafletMap() {
    const lat = 42.000;
    const long = -71.0000;
    const zoomlevel = 12;
    this.map = Leaflet.map('mapId').setView([lat, long], zoomlevel);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  readInJourneys() {
    this.journeyStorageService.read().then(result => {
      this.journeys = result;
      console.log(this.journeys);
    }).catch((error) => {
      console.log(error);
    });
  }

  setNodesAndEdgesWithColor(){
    let index = 0;
    let colorIndex = 0;

    while (index < this.journeys.length){
      this.journeys[index].routes.forEach((route) => {
        const sortedPoints = route.points.sort();
        const coordinates = [];
        const coloredIcon = ColoredIcons.getColoredIconByIndex(colorIndex);

        sortedPoints.forEach((point) => {
          coordinates.push([point.latitude, point.longitude]);
          Leaflet.marker([point.latitude, point.longitude], {icon: coloredIcon}).addTo(this.map)
            .bindPopup('<a>Höhe: </a>' + point.height)
            .openPopup();
        });

        Leaflet.polyline(coordinates, {
          color: ColoredIcons.getColorByIndex(colorIndex),
          width: 10,
        }).addTo(this.map);

        route.highlights.forEach((highlight) => {
          Leaflet.marker([highlight.latitude, highlight.longitude], {icon: coloredIcon}).addTo(this.map)
            .bindPopup(
              highlight.headline + '<br>' +
              highlight.description + '<br>' +
              '<a>Tags: </a>' + highlight.tags.toString() +
              '<a>Höhe: </a>' + highlight.height
            )
            .openPopup();
        });
      });

      index++;
      if (colorIndex < 9){
        colorIndex++;
      }
      else {
        colorIndex = 0;
      }
    }
  }

  /*setNodesAndEdgesWithColor() {
    let index = 0;
    let colorIndex = 0;
    this.pointsOnRoute = this.journey[0].route[0].point;
    const sortedMarkers = this.pointsOnRoute.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    while (index < sortedMarkers.length){
      const startNode = index;
      let journey = sortedMarkers[index].journey;
      while (journey === sortedMarkers[index].journey) {
        journey = sortedMarkers[index].journey;
        const coloredIcon = ColoredIcons.getColoredIconByIndex(colorIndex);
        Leaflet.marker([this.pointsOnRoute[index].lat, this.pointsOnRoute[index].long], {icon: coloredIcon}).addTo(this.map)
          .bindPopup(this.pointsOnRoute[index].city)
          .openPopup();
        index++;
      }

      const coordinates = [];
      for (let node = startNode; node < index; node++){
          coordinates.push([this.pointsOnRoute[node].lat, this.pointsOnRoute[node].long]);
      }
      Leaflet.polyline(coordinates, {
        color: ColoredIcons.getColorByIndex(colorIndex),
        width: 10,
      }).addTo(this.map);

      if (colorIndex < 9){
        colorIndex++;
      }
      else {
        colorIndex = 0;
      }
    }
  }*/

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }
}
