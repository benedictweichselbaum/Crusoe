import {Component, Input, OnInit} from '@angular/core';
import {Journey} from "../../model/journey.model";
import {CrusoeRoute} from "../../model/crosoe.route.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {JourneyStorageService} from "../../service/services/journey.storage.service";
import {CrusoeCameraService} from "../../service/services/crusoe-camera.service";
import {CrusoeGeolocationService} from "../../service/services/crusoe-geolocation.service";
import {Picture} from "../../model/picture.model";
import {Highlight} from "../../model/highlight.model";
import {HighlightMisc} from "../../model/highlight.misc.model";

@Component({
  selector: 'app-journey-highlight-modal',
  templateUrl: './journey-highlight-modal.component.html',
  styleUrls: ['./journey-highlight-modal.component.scss'],
})
export class JourneyHighlightModalComponent implements OnInit {

  @Input() journey: Journey;

  public journeyHighlightForm: FormGroup;
  public tags: Array<string>;
  public pictures: Array<string>;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public storageService: JourneyStorageService,
    public cameraService: CrusoeCameraService,
    public geoService: CrusoeGeolocationService
  ) {
    this.journeyHighlightForm = this.formBuilder.group({
      journeyHighlightHeadline: ['', Validators.required],
      journeyHighlightDescription: [''],
      tag: ['']
    });
  }

  ngOnInit() {
    this.tags = [];
    this.pictures = [];
  }

  public async dismissModal() {
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

  async saveNewJourneyHighlight() {
    const headline = this.journeyHighlightForm.get('journeyHighlightHeadline').value;
    const description = this.journeyHighlightForm.get('journeyHighlightDescription').value;
    const pictures: Array<Picture> = [];
    this.pictures.forEach(pic => {
      pictures.push(new Picture(pic, '', new Array<string>()))
    });
    const position = await this.geoService.getCurrentGeolocation();
    this.journey.highlights.push(new Highlight(
      position.coords.latitude,
      position.coords.longitude,
      position.coords.altitude,
      Date.now(),
      pictures,
      headline,
      description,
      new Array<HighlightMisc>(),
      this.tags
    ));
    await this.storageService.update(this.journey.key, this.journey);
    this.tags = [];
    this.pictures = [];
    await this.dismissModal();
  }

  async addPhoto() {
    const image: string = await this.cameraService.takePicture();
    this.pictures.push(image);
  }

  deletePicture(picture: string) {
    this.pictures = this.pictures.filter(pic => pic != picture);
  }

  public addNewTag() {
    const newTag = this.journeyHighlightForm.get('tag');
    this.tags.push(newTag.value)
    newTag.setValue('')
  }

  deleteTag(tagToDelete: string) {
    this.tags = this.tags.filter(tag => tag !== tagToDelete);
  }

}
