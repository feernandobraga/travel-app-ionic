import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { SegmentChangeEventDetail } from '@ionic/core'

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];

  constructor(
    private placesService: PlacesService
    ) {}

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  /* 
    this is the method that handles the change on the segment menu in the discover.pages
    The method receives an event as parameter
  */
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){

    console.log(event.detail)

  }


}
