import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  onLogin(){
    this.isLoading = true
    this.authService.login();
    
    /* 
      The loading controller takes an object where I can configure some stuff including the message.
      It then returns a promise with a loading element that calls the present method.
      To remove the loading element I had to call the method .dismiss
    */
    this.loadingCtrl
    .create({
      keyboardClose: true,
      message: 'Logging in...'})
    
      .then(loadingEl => {
    
        loadingEl.present()
        
        setTimeout(() => {
          this.isLoading = false
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover')
        }, 1000)

      })

  }

  onLogout(){
    console.log("logout")
    this.authService.logout();
  }

  onSubmit(form: NgForm){
    console.log(form);
  }

}
