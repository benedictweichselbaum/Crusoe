import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Journey} from "../model/journey.model";
import {Md5} from "ts-md5";
import {CrusoeRoute} from "../model/crosoe.route.model";
import {Highlight} from "../model/highlight.model";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-journey-creation',
  templateUrl: './journey-creation.component.html',
  styleUrls: ['./journey-creation.component.scss'],
})
export class JourneyCreationComponent implements OnInit {

  @ViewChild('creationForm') creationFormChild;
  public creationForm: FormGroup;

  constructor(
    private router: Router,
    private storageService: JourneyStorageService,
    private formBuilder: FormBuilder
  ) {
    this.creationForm = this.formBuilder.group({
      journeyName: ['', Validators.required],
      journeySubtitle: ['', Validators.required],
      journeyDescription: ['']
    })
  }

  ngOnInit() {

  }

  routeBackToJourneyOverview() {
    this.router.navigateByUrl('tabs/journeys')
  }

  saveNewJourney() {
    console.log('Test submit')
  }

  private createNewEmptyJourney(name: string, subtitle: string, description: string): Journey {
    return new Journey(Md5.hashStr(name).toString(),
      new Array<CrusoeRoute>(),
      name,
      subtitle,
      new Array<string>(),
      description,
      true,
      Date.now(),
      null,
      new Array<Highlight>(),
      null);
  }
}
