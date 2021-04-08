import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Journey} from "../model/journey.model";
import {JourneyStorageService} from "../service/services/journey.storage.service";

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {

  public certainJourney: Journey = new Journey('-1', null, 'N/A', null, null, null, null, null, null, null, null)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: JourneyStorageService
  ) { }

  ngOnInit() {
    this.storageService.readSingleJourney(this.route.snapshot.paramMap.get('id')).then(result => this.certainJourney = result);
  }

  routeBackToJourneyOverview() {
    this.router.navigateByUrl('tabs/journeys')
  }

}
