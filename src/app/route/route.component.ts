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
    const route = this.routeMock;
    const lat = route.points[0].latitude;
    const long = route.points[0].longitude;
    const zoomlevel = 13;
    this.leafletMap(lat, long, zoomlevel);
    this.setNodesAndEdgesRoute(route);
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

  leafletMap(lat, long, zoomlevel) {
    this.map = Leaflet.map('routeMap').setView([lat, long], zoomlevel);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a>'
    }).addTo(this.map);
  }

  setNodesAndEdgesRoute(route, colorIndex?) {
    if (colorIndex == null){
      colorIndex = 0;
    }
    const sortedPoints = route.points.sort();
    const coordinates = [];

    sortedPoints.forEach((point) => {
      coordinates.push([point.latitude, point.longitude]);
      Leaflet.marker([point.latitude, point.longitude], {icon: ColoredIcons.getColoredIconByIndex(colorIndex)}).addTo(this.map)
        .bindPopup(
          '<span>Zeitpunkt: </span>' + new Date(point.timestamp).toLocaleDateString('de-DE') + '<br>' +
          '<span>Breitengrad: </span>' + point.latitude.toString() + '<br>' +
          '<span>Höhengrad: </span>' + point.longitude.toString() + '<br>' +
          '<span>Höhe: </span>' + point.height
        );
    });

    Leaflet.polyline(coordinates, {
      color: ColoredIcons.getColorByIndex(colorIndex),
      width: 10,
    }).addTo(this.map);

    route.highlights.forEach((highlight) => {
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
    });
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

  routeMock: CrusoeRoute = {
          index: 12345,
          points: [
            {
              latitude: 48.445222,
              longitude: 8.696216,
              height: 1234,
              timestamp: 1617830064525
            },
            {
              latitude: 48.443978,
              longitude: 8.694575,
              height: 1234,
              timestamp: 1617830064526
            },
            {
              latitude: 48.444632,
              longitude: 8.693534,
              height: 1234,
              timestamp: 1617830064535
            },
            {
              latitude: 48.444614,
              longitude: 8.692643,
              height: 1234,
              timestamp: 1617830064545
            },
            {
              latitude: 48.445366,
              longitude: 8.691487,
              height: 1234,
              timestamp: 1617830064575
            },
            {
              latitude: 48.445394,
              longitude: 8.690339,
              height: 1234,
              timestamp: 1617830064595
            },
            {
              latitude: 48.447017,
              longitude: 8.689884,
              height: 1234,
              timestamp: 1617830064625
            }
          ],
          highlights: [
            {
              latitude: 48.445444,
              longitude: 8.696824,
              height: 1234,
              timestamp: 1617830064527,
              pictures: [
                {
                  path: 'https://www.dhbw.de/fileadmin/user_upload/Bilder_Grafiken/Standorte/HORB.jpg',
                  caption: 'Die Quälanstalt',
                  tags: []
                }
              ],
              headline: 'Van Hoofs Quälanstalt',
              description: 'Hier quält van Hoof die Erstsemester',
              miscs: [],
              tags: [
                'DHBW',
                'van Hoof'
              ]
            },
            {
              latitude: 48.442530,
              longitude: 8.686041,
              height: 1234,
              timestamp: 1617830065525,
              pictures: [
                {
                  path: 'https://www.neckarerlebnistal.de/fileadmin/_processed_/f/a/csm_Foto_5_Stadtsilhouette_Horb_898944001d.jpg',
                  caption: 'Fluss Horb mit Schwan',
                  tags: []
                },
                {
                  path: 'https://th.bing.com/th/id/OIP.jIu2kGeZJwTPDwCV41Fc_wAAAA',
                  caption: 'Großaufnahme',
                  tags: []
                }
              ],
              headline: 'Blick über den Fluss',
              description: 'Wunderschönes Horb',
              miscs: [],
              tags: [
                'DHBW',
                'van Hoof'
              ]
            }
          ],
          headline: 'Horber DHBW',
          description: 'Beispiel in Horb',
          tags: [
            'Horb',
            'DHBW'
          ],
          previewPicture: 'https://www.dhbw.de/fileadmin/user_upload/Bilder_Grafiken/Standorte/HORB.jpg',
          departureTimestamp: 1617830064525,
          arrivalTimestamp: 1617890064525
        };
}
