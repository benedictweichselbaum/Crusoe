import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {JourneyStorageService} from "../service/services/journey.storage.service";
import {Journey} from "../model/journey.model";
import {filter} from "rxjs/operators";

@Component({
  selector: 'journeys',
  templateUrl: 'journeys.page.html',
  styleUrls: ['journeys.page.scss']
})
export class JourneysPage implements OnInit {

  public journeys: Array<Journey> = [];
  public shownJourneys: Array<Journey> = [];
  public searchBarInput: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: JourneyStorageService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        console.log(event.url)
        if (event.url === '/tabs/journeys') {
          this.readInJourneys();
          this.searchBarInput = '';
        }
      });
    this.readInJourneys();
  }

  public searchJourneys(event: any) {
    this.shownJourneys = this.journeys.filter(journey => journey.name.toLowerCase().startsWith(event.target.value.toLowerCase()));
  }

  readInJourneys() {
    this.storageService.read().then(result => {
      this.journeys = result;
      this.shownJourneys = result;
    });
  }

  routeToJourney(id: string) {
    this.router.navigate(['tabs', 'journeys', 'journey', id])
  }

  routeToNewJourney() {
    this.router.navigate(['tabs', 'journeys', 'new'])
  }

  tagStyle(tag: string): string {
    return 'width: ' + tag.length*15 + 'px;';
  }
}
