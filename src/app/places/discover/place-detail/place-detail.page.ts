import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place
  private placeSub: Subscription

  constructor(
      private router: ActivatedRoute,
      private navCtrl: NavController,
      private placesService: PlacesService,
      private modalCtrl: ModalController,
      private actionSheetCtrl: ActionSheetController
    ) { }

  ngOnInit() {

    this.router.paramMap.subscribe(
      paramMap => {
        
        if (!paramMap.has('placeId')) {
          this.navCtrl.navigateBack('/place/tabs/discover');
          return;
        }

        // Without Subscription
        //this.place = this.placesService.getPlace(paramMap.get('placeId'));

        /* WITH SUBSCRIPTION
        Here I'm subscribing to the method get Place() that returns an observable and then adding it
        to the places variable which is of type place as declared on line 15
        I'm also storing the value of the subscription to a variable called placesSub so I can destroy the subscription
        when I don't need it anymore.
        */
        this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(
          place => {this.place = place}
        )

      }
    )

  }

  ngOnDestroy(){
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }


  onBookPlace(){
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover')
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    })
    
  }

  
  openBookingModal(mode: 'select' | 'random') { //this syntax requires that mode can only be either select or random 
    console.log(mode);

    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        // componentProps allow you to pass any key value pair you wanted. In this case I passed the place and the mode (select or random)
        componentProps: { selectedPlace: this.place, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        console.log(resultData.data, resultData.role);
      })

  }

}
