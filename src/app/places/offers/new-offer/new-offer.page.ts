import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;


  constructor(

  ) { }

  ngOnInit() {
    /* 
      This is how I created a Reactive From programmatically. I gave the names of the inputs like i.e. title,
      description, price... This names will be used in the formControlName property in the page file.
      To synchronize the data between this form to the form on the new-offer.page we have to add a directive [formGroup]
      that points to the form property declared on line 10, here.
      !*** remember to import the ReactiveForm module inside the component module file ***!
    */
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer(){
    if (!this.form.valid) {
      return
    }
    console.log('Creating offered place...')
    console.log(this.form)
  }

}
