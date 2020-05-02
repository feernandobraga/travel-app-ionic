import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IonicModule } from "@ionic/angular";

import { NewOfferPageRoutingModule } from "./new-offer-routing.module";

import { NewOfferPage } from "./new-offer.page";
import { ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewOfferPageRoutingModule,
    ShareModule,
  ],
  declarations: [NewOfferPage],
})
export class NewOfferPageModule {}
