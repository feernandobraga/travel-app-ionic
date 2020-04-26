import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy{

  offers: Place[];
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router
    ) { }

  ngOnInit() {
    // WITHOUT SUBSCRIPTION
    // this.offers = this.placesService.places

    /*    WITH SUBSCRIPTION
      Here I'm subscribing to the method get Places() that returns an observable and then adding it
      to the offers variable which is an array of Place[];
      I'm also storing the value of the subscription to a variable called placesSub so I can destroy the subscription 
      when I don't need it anymore.
    */
    this.placesSub = this.placesService.places.subscribe(
      places => { this.offers = places}
    )
  }

  ngOnDestroy(){
    if (this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

  /* 
  This can be used when you add/edit/remove your array but the changes do not reflect.
  You can use this instead of RxJS if you want
  ionViewWillEnter() {
    this.offers = this.placesService.places
  } */

  onEdit(offerId: string, slidingItem: IonItemSliding){
    // I had to pass the sliding item from the view as an argument as well so I could close it
    slidingItem.close();
    this.router.navigate(["/", "places", "tabs", "offers", "edit", offerId]);
    console.log('Editing item ', offerId)
  }

}
