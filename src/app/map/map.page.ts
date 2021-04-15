import {JourneyStorageService} from '../service/services/journey.storage.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {ColoredIcons} from './colored-icons';
import {Journey} from '../model/journey.model';
import {Highlight} from '../model/highlight.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
/***
 * https://edupala.com/how-to-add-leaflet-map-in-ionic/
 ***/
export class MapPage implements OnInit, OnDestroy {

  journeys: Journey[];
  map: Leaflet.Map;
  pictureKey = 0;

  constructor(private storageService: JourneyStorageService) {
  }

  ngOnInit() {
    // Um mit dem Storage zu testen: read in Journeys
    // this.readInJourneys();
  }

  ionViewDidEnter() {
    this.journeys = this.journeyMock;
    const lat = this.journeys[0].routes[0].points[0].latitude;
    const long = this.journeys[0].routes[0].points[0].longitude;
    const zoomlevel = 10;
    this.leafletMap(lat, long, zoomlevel);
    this.setNodesAndEdgesJourney();
  }

  readInJourneys() {
    this.storageService.read().then(result => {
      this.journeys = result;
      console.log(this.journeys);
    }).catch((error) => {
      console.log(error);
    });
  }

  leafletMap(lat, long, zoomlevel) {
    this.map = Leaflet.map('mapId').setView([lat, long], zoomlevel);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a>'
    }).addTo(this.map);
  }

  setNodesAndEdgesJourney() {
    let index = 0;
    let colorIndex = 0;

    while (index < this.journeys.length) {
      this.journeys[index].routes.forEach((route) => this.setNodesAndEdgesRoute(route, colorIndex));

      index++;
      if (colorIndex < 8) {
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
        )
        .openPopup();
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
        )
        .openPopup();
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

  journeyMock: Journey[] = [
    {
      key: '1234',
      routes: [
        {
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
        },
        {
          index: 12345,
          points: [
            {
              latitude: 48.441626,
              longitude: 8.684483,
              height: 1234,
              timestamp: 1617830064525
            },
            {
              latitude: 48.442530,
              longitude: 8.686041,
              height: 1234,
              timestamp: 1617830064525
            },
            {
              latitude: 48.442729,
              longitude: 8.687970,
              height: 1234,
              timestamp: 1617830064525
            },
            {
              latitude: 48.442749,
              longitude: 8.690722,
              height: 1234,
              timestamp: 1617830064525
            },
            {
              latitude: 48.443432,
              longitude: 8.691226,
              height: 1234,
              timestamp: 1617830064525
            }
          ],
          highlights: [
            {
              latitude: 48.442530,
              longitude: 8.686041,
              height: 1234,
              timestamp: 1617830064525,
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
          headline: 'Am Fluss entlang',
          description: 'Eine zweite Route im Horber Beispiel',
          tags: [
            'Horb',
            'DHBW',
            'Fluss'
          ],
          previewPicture: 'https://th.bing.com/th/id/OIP.jIu2kGeZJwTPDwCV41Fc_wAAAA',
          departureTimestamp: 1617830064525,
          arrivalTimestamp: 1617890064525
        }
      ],
      tags: [
        'BaWü',
        'DHBW'
      ],
      name: 'Horb',
      subtitle: 'Unterueberschrift',
      description: 'Beispielroute',
      ownJourney: true,
      departureTimestamp: 1617830064525,
      arrivalTimestamp: 1617890064525,
      highlights: [
        {
          latitude: 48.445444,
          longitude: 8.706824,
          height: 1234,
          timestamp: 1617830064525,
          pictures: [],
          headline: 'Highlight 1',
          description: 'Routenhighlight abseits der Route',
          miscs: [],
          tags: [
            'Horb'
          ]
        },
        {
          latitude: 48.444632,
          longitude: 8.693534,
          height: 1234,
          timestamp: 1617830064525,
          pictures: [],
          headline: 'Highlight 2',
          description: 'Noch ein Highlight von Horb',
          miscs: [],
          tags: [
            'Horb',
            'Innenstadt'
          ]
        }
      ],
      previewPicture: 'https://www.dhbw.de/fileadmin/user_upload/Bilder_Grafiken/Standorte/HORB.jpg'
    }
  ];
}
