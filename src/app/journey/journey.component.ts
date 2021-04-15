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

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {

  public certainJourney: Journey = new Journey('-1', new Array<CrusoeRoute>(), 'N/A', '', new Array<string>(), '', true, null, null, new Array<Highlight>(), '')

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
    return await modal.present();
  }

  convertToReadableDate(dateNumber: number): string {
    return new Date(dateNumber).toLocaleString();
  }

  tagStyle(tag: string): string {
    return 'width: ' + tag.length*15 + 'px;';
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
  }
}
