import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Place

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

        this.place = this.placesService.getPlace(paramMap.get('placeId'));

      }
    )

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
        // componentProps allow you to pass any key value pair you wanted. In this case I passed the place
        componentProps: { selectedPlace: this.place }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        console.log(resultData.data, resultData.role);
      })

  }

}
