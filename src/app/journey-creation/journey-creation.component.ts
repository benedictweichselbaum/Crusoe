import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-journey-creation',
  templateUrl: './journey-creation.component.html',
  styleUrls: ['./journey-creation.component.scss'],
})
export class JourneyCreationComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  routeBackToJourneyOverview() {
    this.router.navigateByUrl('tabs/journeys')
  }
}
