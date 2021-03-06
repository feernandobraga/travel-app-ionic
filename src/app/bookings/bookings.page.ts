import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookingService } from "./booking.service";
import { Booking } from "./booking.model";
import { IonItemSliding, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;
  isLoading = false;

  constructor(
    private bookingsService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter() {
    /* 
        It seems like this method is fetching the info from the API and creating the array locally, so ngOnInit
        has some data  
    */
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    /* 
      This method receives a bookingId and a reference to the slidingItem from the template page.
      The sliding reference is so I can close it programmatically.
      Then method creates a loadingController to display a spinner when a booking is cancelled and after that dismiss it.
     */
    slidingEl.close();
    this.loadingCtrl
      .create({
        message: "Cancelling...",
      })
      .then(loadingEl => {
        loadingEl.present();
        this.bookingsService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
