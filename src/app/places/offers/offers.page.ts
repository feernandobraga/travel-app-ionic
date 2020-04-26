import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offers: Place[];

  constructor(
    private placesService: PlacesService,
    private router: Router
    ) { }

  ngOnInit() {
    this.offers = this.placesService.places
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
