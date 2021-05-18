import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JourneyStorageService} from "../../service/services/journey.storage.service";
import {AlertController, ModalController} from "@ionic/angular";
import {CrusoeCameraService} from "../../service/services/crusoe-camera.service";
import {Journey} from "../../model/journey.model";
import {CrusoeRoute} from "../../model/crosoe.route.model";
import {Highlight} from "../../model/highlight.model";

@Component({
  selector: 'app-journey-edit-modal',
  templateUrl: './journey-edit-modal.component.html',
  styleUrls: ['./journey-edit-modal.component.scss'],
})
export class JourneyEditModalComponent implements OnInit {

  @ViewChild('creationForm') creationFormChild;
  @Input() journey: Journey = new Journey('-1', new Array<CrusoeRoute>(), 'N/A', '', new Array<string>(), '', true, null, null, new Array<Highlight>(), '')
  public editForm: FormGroup;
  public tags: Array<string>;
  public picture: string;

  constructor(
    private router: Router,
    private storageService: JourneyStorageService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private cameraService: CrusoeCameraService,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      journeyName: [this.journey.name, Validators.required],
      journeySubtitle: [this.journey.subtitle, Validators.required],
      journeyDescription: [this.journey.description],
      tag: ['']
    })
    this.tags = this.journey.tags;
    this.picture = this.journey.previewPicture;
  }

  async saveNewJourney() {
    let journeyAlreadyExists: boolean = false;
    const journeyName = this.editForm.get('journeyName').value;
    const journeySubtitle = this.editForm.get('journeySubtitle').value;
    const journeyDescription = this.editForm.get('journeyDescription').value;
    if (!(journeyName === this.journey.name)) {
      await this.storageService.read().then(results => results.forEach(result => {
        if (result.name === journeyName) {
          journeyAlreadyExists = true;
        }
      }));
    }

    if (journeyAlreadyExists) {
      await this.showAlertWhenInvalid();
    } else {
      await this.updateJourney(journeyName, journeySubtitle, journeyDescription, this.tags, this.picture);
      this.tags = [];
      this.picture = "";
      await this.dismissModal();
    }
  }

  public async dismissModal() {
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

  addNewTag() {
    const newTag = this.editForm.get('tag');
    this.tags.push(newTag.value)
    newTag.setValue('')
  }

  deleteTag(tagToDelete: string) {
    this.tags = this.tags.filter(tag => tag !== tagToDelete);
  }

  deletePicture() {
    this.picture = '';
  }

  async addPicture() {
    this.picture = await this.cameraService.takePicture();
  }

  private async updateJourney(name: string, subtitle: string, description: string, tags: Array<string>, pic: string) {
    this.journey.name = name;
    this.journey.subtitle = subtitle;
    this.journey.description = description;
    this.journey.tags = tags;
    this.journey.previewPicture = pic;
    await this.storageService.update(this.journey.key, this.journey);
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
