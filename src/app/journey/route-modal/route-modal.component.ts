import {Component, Input, OnInit} from '@angular/core';
import {Journey} from "../../model/journey.model";
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JourneyStorageService} from "../../service/services/journey.storage.service";
import {CrusoeRoute} from "../../model/crosoe.route.model";
import {Point} from "../../model/point.model";
import {Highlight} from "../../model/highlight.model";

@Component({
  selector: 'app-route-modal',
  templateUrl: './route-modal.component.html',
  styleUrls: ['./route-modal.component.scss'],
})
export class RouteModalComponent implements OnInit {

  @Input() public journey: Journey;
  public routeForm: FormGroup;
  public tags: Array<string>;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private storageService: JourneyStorageService
  ) {
    this.routeForm = this.formBuilder.group({
      routeName: ['', Validators.required],
      routeDescription: [''],
      tag: ['']
    });
  }

  ngOnInit() {
    this.tags = [];
  }

  public dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public addNewTag() {
    const newTag = this.routeForm.get('tag');
    this.tags.push(newTag.value)
    newTag.setValue('')
  }

  deleteTag(tagToDelete: string) {
    this.tags = this.tags.filter(tag => tag !== tagToDelete);
  }

  public async saveNewRoute() {
    const routeName = this.routeForm.get('routeName').value;
    const routeDescription = this.routeForm.get('routeDescription').value;
    this.journey.routes.push(new CrusoeRoute(this.getNextRouteIndex(),
      new Array<Point>(),
      new Array<Highlight>(),
      routeName,
      routeDescription,
      this.tags,
      '',
      Date.now(),
      null));
    this.tags = [];
    this.storageService.update(this.journey.key, this.journey).then(result => {
      this.dismissModal();
    });
  }

  private getNextRouteIndex() {
    let maxIndex = 0;
    this.journey.routes.forEach(route => {
      maxIndex = Math.max(maxIndex, route.index);
    });
    return maxIndex + 1;
  }
}
