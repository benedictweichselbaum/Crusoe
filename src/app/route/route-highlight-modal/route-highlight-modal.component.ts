import {Component, Input, OnInit} from '@angular/core';
import {Journey} from "../../model/journey.model";
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JourneyStorageService} from "../../service/services/journey.storage.service";
import {CrusoeCameraService} from "../../service/services/crusoe-camera.service";
import {CrusoeRoute} from "../../model/crosoe.route.model";
import {Picture} from "../../model/picture.model";
import {CrusoeGeolocationService} from "../../service/services/crusoe-geolocation.service";
import {Highlight} from "../../model/highlight.model";
import {HighlightMisc} from "../../model/highlight.misc.model";

@Component({
  selector: 'app-route-highlight-modal',
  templateUrl: './route-highlight-modal.component.html',
  styleUrls: ['./route-highlight-modal.component.scss'],
})
export class RouteHighlightModalComponent implements OnInit {

  @Input() journey: Journey;
  @Input() route: CrusoeRoute;

  public routeHighlightForm: FormGroup;
  public tags: Array<string>;
  public pictures: Array<string>;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public storageService: JourneyStorageService,
    public cameraService: CrusoeCameraService,
    public geoService: CrusoeGeolocationService
  ) {
    this.routeHighlightForm = this.formBuilder.group({
      routeHighlightHeadline: ['', Validators.required],
      routeHighlightDescription: [''],
      tag: ['']
    });
  }

  ngOnInit() {
    this.tags = [];
    this.pictures = [];
  }

  public dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async saveNewRouteHighlight() {
    const headline = this.routeHighlightForm.get('routeHighlightHeadline').value;
    const description = this.routeHighlightForm.get('routeHighlightDescription').value;
    const pictures: Array<Picture> = [];
    this.pictures.forEach(pic => {
      pictures.push(new Picture(pic, '', new Array<string>()))
    });
    const position = await this.geoService.getCurrentGeolocation();
    this.route.highlights.push(new Highlight(
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
    const indexOfRoute = this.journey.routes.indexOf(this.journey.routes.find(r => r.index === this.route.index));
    this.journey.routes[indexOfRoute] = this.route;
    await this.storageService.update(this.journey.key, this.journey);
    this.tags = [];
    this.pictures = [];
    this.dismissModal();
  }

  async addPhoto() {
    const image: string = await this.cameraService.takePicture();
    this.pictures.push(image);
  }

  deletePicture(picture: string) {
    this.pictures = this.pictures.filter(pic => pic != picture);
  }

  public addNewTag() {
    const newTag = this.routeHighlightForm.get('tag');
    this.tags.push(newTag.value)
    newTag.setValue('')
  }

  deleteTag(tagToDelete: string) {
    this.tags = this.tags.filter(tag => tag !== tagToDelete);
  }
}
