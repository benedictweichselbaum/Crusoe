import {Component, OnInit} from '@angular/core';
import {JourneyStorageService} from '../service/services/journey.storage.service';
import {Journey} from '../model/journey.model';
import {PickerController} from "@ionic/angular";
import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-tab3',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss']
})
export class AnalyticsPage implements OnInit {

  public journeys: Array<Journey> = [];
  public journey: Journey = null;
  public journeyOptions: Array<string> = ['Alle Reisen'];

  public distance: string = '0';
  public altitude: number = 0;
  public numberOfHighlights: number = 0;
  public numberOfRoutes: number = 0;
  public numberOfPoints: number = 0;

  public quotes: Array<string> = [
    "Die Welt ist ein Buch. Wer nie reist, sieht nur eine Seite davon.\nAugustinus Aurelius",
    "Zögere nie, weit fortzugehen, hinter alle Meere, alle Grenzen, alle Länder, allen Glaubens\nAmin Maalouf",
    "Das Leben ist eine Reise. Nimm nicht zu viel Gepäck mit\nBilly Idol",
    "Einmal im Jahr solltest du einen Ort besuchen, an dem du noch nie warst\nDalai Lama",
    "Wege entstehen dadurch, dass man sie geht\nFranz Kafka",
    "Reisen macht einen bescheiden. Man erkennt, welch kleinen Platz man in der Welt besetzt\nGustave Flaubert",
    "Zu reisen ist zu leben\nHans Christian Andersen",
    "Die beste Bildung findet ein gescheiter Mensch auf Reisen\nJohann Wolfgang von Goethe",
    "Die gefährlichste aller Weltanschauungen ist die Weltanschauung der Leute, welche die Welt nicht angeschaut haben\nAlexander von Humboldt"
  ];
  public currentQuote: string = this.quotes[0];

  constructor(
    private storageService: JourneyStorageService,
    private pickerController: PickerController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(async (event: any) => {
        if (event.url.startsWith('/tabs/journeys/analytics')) {
          await this.reloadJourneys();
        }
      });
    this.changeQuote();
    await this.reloadJourneys();
  }

  async reloadJourneys() {
    this.journeys = await this.storageService.read();
    this.journeyOptions = ['Alle Reisen'];
    this.journeys.forEach(journey => this.journeyOptions.push(journey.name));
    this.createAnalyticsForAllJourneys();
  }

  public randomNumber(from: number, to: number): number {
    return (Math.floor(Math.random() * (to + 1)) + (from + 1)) - 1;
    // console.log(s);
    // return s;
  }

  public changeQuote() {
    this.currentQuote = this.quotes[this.randomNumber(0, this.quotes.length - 1)];
  }

  async showJourneyPicker() {
    await this.reloadJourneys();
    const options = {
      buttons: [
        {
          text: "Abbrechen",
          role: 'cancel',
        },
        {
          text:'Ok',
          handler:(value:any) => {
            this.createAnalytics(this.loadSingleJourneyForAnalytics(value));
          }
        }
      ],
      columns:[{
        name:'Reisen',
        options: this.getPickerOptions()
      }]
    };

    const picker = await this.pickerController.create(options);
    await picker.present();
  }

  public loadSingleJourneyForAnalytics(pickedValue: any): boolean {
    const pickedJourney = this.journeys.filter(j => j.name === pickedValue.Reisen.text);
    if (pickedJourney.length === 0) {
      this.journey = null;
      return true;
    }
    this.journey = pickedJourney[0];
    return false;
  }

  public createAnalytics(allJourneys: boolean) {
    this.resetAnalytics();
    if (allJourneys) {
      this.createAnalyticsForAllJourneys();
    } else {
      this.distance = AnalyticsPage.convertDistanceToKm(this.getDistanceForJourney(this.journey));
      this.numberOfHighlights = this.journey.highlights.length;
      this.numberOfRoutes = this.journey.routes.length;
      let numPoints = 0;
      this.journey.routes.forEach(route => numPoints += route.points.length);
      this.numberOfPoints = numPoints;
      this.altitude = this.calculateAltitudeForJourney(this.journey);
    }
  }

  private calculateAltitudeForJourney(journey: Journey): number {
    let altitudeDifference = 0;
    journey.routes.forEach(route => {
      for (let i = 1; i < route.points.length; i++) {
        console.log(route.points[i].height + '' +  route.points[i - 1].height);
        altitudeDifference += Math.abs(route.points[i].height - route.points[i - 1].height);
      }
    });
    console.log(altitudeDifference)
    return altitudeDifference;
  }

  private getDistanceForJourney(journey: Journey) {
    let dist = 0;
    journey.routes.forEach(route => {
      for (let i = 1; i < route.points.length; i++) {
        const point1 = route.points[i];
        const point2 = route.points[i-1]
        dist += AnalyticsPage.distanceBetweenTwoPoints(point1.longitude, point1.latitude, point2.longitude, point2.latitude);
      }
    });
    return dist;
  }

  private static convertDistanceToKm(dist: number) {
    return (dist / 1000).toFixed(2);
  }

  private createAnalyticsForAllJourneys() {
    let completeDistance = 0;
    this.journeys.forEach(journey => {
      completeDistance += this.getDistanceForJourney(journey);
      this.numberOfHighlights += journey.highlights.length;
      this.numberOfRoutes += journey.routes.length;
      journey.routes.forEach(route => this.numberOfPoints += route.points.length);
      this.altitude += this.calculateAltitudeForJourney(journey);
    });
    this.distance = AnalyticsPage.convertDistanceToKm(completeDistance);

  }

  private resetAnalytics() {
    this.numberOfHighlights = 0;
    this.numberOfPoints = 0;
    this.numberOfRoutes = 0;
    this.altitude = 0;
    this.distance = '0';
  }

  getPickerOptions() {
    const options = [];
    this.journeyOptions.forEach(option => options.push({text: option, value: option}));
    return options;
  }

  async saveJourneyMock() {
    const key = await this.storageService.nextKey();
    this.journeyMock.key = key;
    await this.storageService.create(key, this.journeyMock);
  }

  private static distanceBetweenTwoPoints(lon1: number, lat1: number, lon2: number, lat2: number): number {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const phi3 = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(phi3/2) * Math.sin(phi3/2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
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
