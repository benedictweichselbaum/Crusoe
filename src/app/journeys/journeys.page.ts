import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {Journey} from "../model/journey.model";

@Component({
  selector: 'journeys',
  templateUrl: 'journeys.page.html',
  styleUrls: ['journeys.page.scss']
})
export class JourneysPage implements OnInit {

  private journeys: Array<Journey> = []

  constructor(
    private router: Router,
    private storageService: JourneyStorageService
  ) {}

  ngOnInit(): void {
    console.warn('Test save')
    this.storageService.create('4', new Journey(4, null, 'Norwegen', 'Europa', null, 'Das ist die Beschreibung des Norwegen Trips', null, null, null, null, null))
    this.storageService.read().then(result => {this.journeys = result; console.debug(result)});
  }

  routeToJourney(id: number) {
    this.router.navigateByUrl('/tabs/journeys/journey/' + id);
  }

  routeToNewJourney() {
    this.router.navigateByUrl('/tabs/journeys/new')
  }
}
