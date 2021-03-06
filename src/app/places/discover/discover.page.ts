import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../place.model";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  isLoading = false;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    /*  WITHOUT SUBSCRIPTION 
      this.loadedPlaces = this.placesService.places;
      this.listedLoadedPlaces = this.loadedPlaces.slice(1); 
    */

    /* WITH SUBSCRIPTION 
      Here I'm subscribing to the method get Places() that returns an observable and then adding it
      to the loadedPlaces variable which is an array of Place[];
      I'm also storing the value of the subscription to a variable called placesSub so I can destroy the subscription
      when I don't need it anymore.
    */
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  /* 
    this is the method that handles the change on the segment menu in the discover.pages
    The method receives an event as parameter
  */
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === "all") {
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(
          place => place.userId !== userId
        );
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }
    });
    console.log(event.detail);
  }
}
