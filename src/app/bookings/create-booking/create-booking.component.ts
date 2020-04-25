import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from '../../places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

   
  //  This is how the component talks to the child component (the modal in this case)
  // so this component can receive a selected place and the selected mode.
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  
  //@ViewChild is to get access to any element from the template. In this case I'm getting access to the form
  // the I named 'f' on the template
  @ViewChild('f', {static:true}) form: NgForm;

  startDate: string;
  endDate: string

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(availableFrom.getTime() 
        + Math.random() 
        * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
    
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() *
        (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    
      }
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace(){
    if (!this.form.valid || !this.datesValid) {
      return;
    }

    /* this.modalCtrl.dismiss(
      {message: 'Place booked'}, 
      'confirm'); */

    /*  
    when closing the modal I can pass the information that I want to whoever called the modal. In this case is the
    place-detail page. So I'm getting the information from the form thanks to the @ViewChild
    */
    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        guestNumber: this.form.value['guest-number'],
        startDate: this.form.value['date-from'],
        endDate: this.form.value['date-to']
      }
    })
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    
    return endDate > startDate //only returns true if end date is greater than start date
  }

}
