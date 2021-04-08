import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {ColoredIcons} from './colored-icons';

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
  propertyList = [];

  constructor() {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.leafletMap();
  }

  leafletMap() {
    const lat = 42.000;
    const long = -71.0000;
    const zoomlevel = 12;
    this.map = Leaflet.map('mapId').setView([lat, long], zoomlevel);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    fetch('assets/markers.json')
      .then(res => res.json())
      .then(data => {
        this.propertyList = data.properties;
        this.setMarkersWithColor();
      })
      .catch(err => console.error(err));
  }

  setMarkersWithColor() {
    const sortedMarkers = this.propertyList.sort((a, b) => a.journey.localeCompare(b.journey));
    let index = 0;
    let colorIndex = 0;
    while (index < sortedMarkers.length){
      let journey = sortedMarkers[index].journey;
      console.log('journey', journey);
      while (journey === sortedMarkers[index].journey) {
        journey = sortedMarkers[index].journey;
        console.log(journey);
        const coloredIcon = ColoredIcons.getColoredIconByIndex(colorIndex);
        Leaflet.marker([this.propertyList[index].lat, this.propertyList[index].long], {icon: coloredIcon}).addTo(this.map)
          .bindPopup(this.propertyList[index].city)
          .openPopup();
        console.log(index);
        console.log(this.propertyList[index].city, this.propertyList[index].lat, this.propertyList[index].long);
        index++;
      }
      if (colorIndex < 9){
        colorIndex++;
      }
      else {
        colorIndex = 0;
      }
    }
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }
}
