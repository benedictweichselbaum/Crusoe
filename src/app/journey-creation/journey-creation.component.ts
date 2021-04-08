import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Journey} from "../model/journey.model";
import {CrusoeRoute} from "../model/crosoe.route.model";
import {Highlight} from "../model/highlight.model";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-journey-creation',
  templateUrl: './journey-creation.component.html',
  styleUrls: ['./journey-creation.component.scss'],
})
export class JourneyCreationComponent implements OnInit {

  @ViewChild('creationForm') creationFormChild;
  public creationForm: FormGroup;
  public tags: Array<string>;

  constructor(
    private router: Router,
    private storageService: JourneyStorageService,
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) {
    this.creationForm = this.formBuilder.group({
      journeyName: ['', Validators.required],
      journeySubtitle: ['', Validators.required],
      journeyDescription: [''],
      tag: ['']
    })
  }

  ngOnInit() {
    this.tags = [];
  }

  routeBackToJourneyOverview() {
    this.router.navigate(['tabs', 'journeys'])
  }

  async saveNewJourney() {
    let journeyAlreadyExists: boolean = false;
    const journeyName = this.creationForm.get('journeyName').value;
    const journeySubtitle = this.creationForm.get('journeySubtitle').value;
    const journeyDescription = this.creationForm.get('journeyDescription').value;
    await this.storageService.read().then(results => results.forEach(result => {
      if (result.name === journeyName) {
        journeyAlreadyExists = true;
      }
    }));

    if (journeyAlreadyExists) {
      this.showAlertWhenInvalid();
    } else {
      const newJourney: Journey = await this.createNewEmptyJourney(journeyName, journeySubtitle, journeyDescription, this.tags);
      this.storageService.create(newJourney.key, newJourney).then(result => {
        this.tags = [];
        this.routeBackToJourneyOverview();
      });
    }
  }

  addNewTag() {
    const newTag = this.creationForm.get('tag');
    this.tags.push(newTag.value)
    newTag.setValue('')
  }

  deleteTag(tagToDelete: string) {
    this.tags = this.tags.filter(tag => tag !== tagToDelete);
  }

  private async createNewEmptyJourney(name: string, subtitle: string, description: string, tags: Array<string>): Promise<Journey> {
    return new Journey(await this.storageService.nextKey(),
      new Array<CrusoeRoute>(),
      name,
      subtitle,
      tags,
      description,
      true,
      Date.now(),
      null,
      new Array<Highlight>(),
      null);
  }

  private async showAlertWhenInvalid() {
    const alert = await this.alertController.create({
      header: 'Ups!',
      message: 'Eine Reise mit diesem Namen existiert leider schon. Korrigiere deine Eingabe.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
