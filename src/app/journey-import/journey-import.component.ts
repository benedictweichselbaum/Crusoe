import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {JourneyStorageService} from '../service/services/journey.storage.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Highlight} from '../model/highlight.model';
import {Journey} from '../model/journey.model';
import {CrusoeRoute} from '../model/crosoe.route.model';
import {JourneyDtoModel} from '../model/journey.dto.model';
import {CrusoeRouteDtoModel} from '../model/crusoe.route.dto.model';

@Component({
  selector: 'app-journey-import',
  templateUrl: './journey-import.component.html',
  styleUrls: ['./journey-import.component.scss'],
})
export class JourneyImportComponent implements OnInit {

  @ViewChild('creationForm') creationFormChild;
  public creationForm: FormGroup;

  constructor(
    private router: Router,
    private storageService: JourneyStorageService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) {
    this.creationForm = this.formBuilder.group({
      rawJourneyDtoAsJson: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async routeBackToJourneyOverview() {
    await this.router.navigate(['tabs', 'journeys']);
  }

  private async showAlertWhenInvalid(infoMessage) {
    const alert = await this.alertController.create({
      header: 'Ups!',
      message: infoMessage,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async createNewJourney(name: string, subtitle: string, tags: Array<string>, description: string, ownJounrey: boolean, departureTimestamp: number, arrivalTimestamp: number, highlights: Array<Highlight>, pic: string): Promise<Journey> {
    return new Journey(await this.storageService.nextKey(),
      new Array<CrusoeRoute>(),
      name,
      subtitle,
      tags,
      description,
      ownJounrey,
      departureTimestamp,
      arrivalTimestamp,
      highlights,
      pic);
  }

  private mapCrusoeRouteDtoToCrusoeRoute(crusoeRouteDto: CrusoeRouteDtoModel, journey: Journey){
    return new CrusoeRoute(this.getNextRouteIndex(journey), crusoeRouteDto.points, crusoeRouteDto.highlights, crusoeRouteDto.headline, crusoeRouteDto.description,
      crusoeRouteDto.tags, crusoeRouteDto.previewPicture, crusoeRouteDto.departureTimestamp, crusoeRouteDto.arrivalTimestamp);
  }

  private getNextRouteIndex(journey) {
    let maxIndex = 0;
    journey.routes.forEach(route => {
      maxIndex = Math.max(maxIndex, route.index);
    });
    return maxIndex + 1;
  }

  async saveImportedJourney(){
    const data = this.creationForm.get('rawJourneyDtoAsJson').value;
    try {
      const journeyDto = JSON.parse(data) as JourneyDtoModel;
      let journeyAlreadyExists = false;
      await this.storageService.read().then(results => results.forEach(result => {
        if (result.name === journeyDto.name) {
          journeyAlreadyExists = true;
        }
      }));

      if (journeyAlreadyExists) {
        await this.showAlertWhenInvalid('Eine Reise mit diesem Namen existiert leider schon. Korrigiere deine Eingabe.');
      } else {
        const newJourney: Journey = await this.createNewJourney(journeyDto.name, journeyDto.subtitle, journeyDto.tags, journeyDto.description,
          journeyDto.ownJourney, journeyDto.departureTimestamp, journeyDto.arrivalTimestamp, journeyDto.highlights, journeyDto.previewPicture);

        journeyDto.routes.forEach((routeDto) => {
          const route = this.mapCrusoeRouteDtoToCrusoeRoute(routeDto, newJourney);
          newJourney.routes.push(route);
        });

        this.storageService.create(newJourney.key, newJourney).then(result => {
          this.routeBackToJourneyOverview();
        }).catch((err) => console.log(err));
      }
    }
    catch (err){
      await this.showAlertWhenInvalid('Bei der Verarbeitung des übergebenen Textes ist ein Fehler aufgetreten. Es werden nur gültige JSON-Strings verarbeitet. Prüfe deine Eingaben!');
      console.log(err);
    }
  }
}
