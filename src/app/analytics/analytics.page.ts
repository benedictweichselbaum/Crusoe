import { Component } from '@angular/core';
import {JourneyStorageService} from '../service/services/journey.storage.service';
import {Journey} from '../model/journey.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss']
})
export class AnalyticsPage {

  constructor(private storageService: JourneyStorageService) {}

  async saveJourneyMock(){
    const key = await this.storageService.nextKey();
    this.journeyMock.key = key;
    this.storageService.create(key, this.journeyMock).then(result => {
    });
  }

  journeyMock: Journey = {
    key: '1234',
    name: 'Horb am Neckar Reise',
    routes: [
      {
        index: 1,
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
        index: 2,
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
  };
}
