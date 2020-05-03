import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PlaceDetailPageRoutingModule } from "./place-detail-routing.module";

import { PlaceDetailPage } from "./place-detail.page";
import { CreateBookingComponent } from "../../../bookings/create-booking/create-booking.component";
import { ShareModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
    ShareModule,
  ],
  declarations: [PlaceDetailPage, CreateBookingComponent],
  entryComponents: [CreateBookingComponent],
})
export class PlaceDetailPageModule {}
