import { Component, OnInit } from "@angular/core";
import { AuthService, AuthResponseData } from "./auth.service";
import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  /*  BEFORE Http requests 
    onLogin() {
    this.isLoading = true;
    this.authService.login();

    /* 
      The loading controller takes an object where I can configure some stuff including the message.
      It then returns a promise with a loading element that calls the present method.
      To remove the loading element I had to call the method .dismiss
    */
  /*
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "Logging in...",
      })

      .then(loadingEl => {
        loadingEl.present();

        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl("/places/tabs/discover");
        }, 1000);
      });
  }
 */

  authenticate(email: string, password: string) {
    this.isLoading = true;

    /* 
      The loading controller takes an object where I can configure some stuff including the message.
      It then returns a promise with a loading element that calls the present method.
      To remove the loading element I had to call the method .dismiss
    */
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "Logging in...",
      })

      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl("/places/tabs/discover");
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = "Could not sign you up, please try again";
            if (code === "EMAIL_EXISTS") {
              message = "This email address already exists";
            } else if (code === "EMAIL_NOT_FOUND") {
              message = "E-Mail address could not be found";
            } else if (code === "INVALID_PASSWORD") {
              message = "Login and password don't match";
            }
            this.showAlert(message);
          }
        );
      });
  }

  onLogout() {
    console.log("logout");
    this.authService.logout();
  }

  onSubmit(form: NgForm) {
    // first check is the form is really valid or if the user is trying something dodgy
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: "Authentication failed",
        message: message,
        buttons: ["Okay"],
      })
      .then(alertEl => alertEl.present());
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
