import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Place;
  form: FormGroup;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }

      /*  BEFORE SUBSCRIPTION 
        this.place = this.placesService.getPlace(paramMap.get('placeId')); 
      */

      /* WITH SUBSCRIPTION
        Here I'm subscribing to the method get Place() that returns an observable and then adding it
        to the place variable which is of type Place;
        I'm also storing the value of the subscription to a variable called placesSub so I can destroy the subscription
        when I don't need it anymore.
      */ 

      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(
        place => {
          this.place = place
          /*
            !*** remember to import the ReactiveForm module inside the component module file ***!
            This is how I created a Reactive From programmatically. I gave the names of the inputs like i.e. title,
            description, price... This names will be used in the formControlName property in the page file.
            To synchronize the data between this form to the form on the new-offer.page we have to add a directive [formGroup]
            that points to the form property declared on line 10, here.
          */
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),

            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            })

          }) // end FormGroup
        } // end arrow function
      ) // end subscribe

    }); 
  } // end ngOnInit()

  ngOnDestroy(){
    if (this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

  onUpdateOffer(){
    if (!this.form.valid) {
      return
    }
    console.log('Editing offered place...')

    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingel => {
      loadingel.present()
      this.placesService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(() => {
        loadingel.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    })
    

    

  }

}
