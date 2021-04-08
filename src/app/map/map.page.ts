import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {greenIcon} from './colored-icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
/***
 * https://edupala.com/how-to-add-leaflet-map-in-ionic/
 ***/
export class MapPage implements OnInit, OnDestroy{

  map: Leaflet.Map;
  propertyList = [];
  constructor() {}

  ngOnInit() { }
  ionViewDidEnter() { this.leafletMap(); }

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
        this.setMarkers();
      })
      .catch(err => console.error(err));
  }

  setMarkers(){
    for (const property of this.propertyList) {
      console.log(property.city, property.lat, property.long);
      Leaflet.marker([property.lat, property.long], {icon: greenIcon}).addTo(this.map)
        .bindPopup(property.city)
        .openPopup();
    }
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }
}
