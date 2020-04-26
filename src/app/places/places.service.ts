import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  /* 
    BehaviorSubject is used with RxJS for creating Observables with default value (in this case our Place[] array)
    so we can subscribe to it.
    The logic behind it is: You create an observable here, for example, and the somewhere else you subscribe
    to the observable. This way, if the data stream changes, IONIC will display the changes properly.
    This fixes issues with cached pages/data 
  */
  private _places = new BehaviorSubject<Place[]>(
    [
      new Place(
        'p1',
        'Manhattan Mansion',
        'In the heart of New York City',
        'https://lp-cms-production.imgix.net/2019-06/GettyImages-538096543_medium.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4',
        149.99,
        new Date('2019-01-01'),
        new Date('2019-12-13'),
        'abc'
      ),
      new Place(
        'p2',
        'L\'Amour Toujours',
        'A romantic place in Paris!',
        'https://photos.mandarinoriental.com/is/image/MandarinOriental/paris-2017-home?$MO_masthead-property-mobile$',
        189.99,
        new Date('2019-01-01'),
        new Date('2019-12-13'),
        'abc'
      ),
      new Place(
        'p3',
        'The Foggy Palace',
        'Not your average city trip',
        'https://data.whicdn.com/images/310015645/original.jpg',
        99.99,
        new Date('2019-01-01'),
        new Date('2019-12-13'),
        'abc'
      )
    ]
  );

  get places(){
    // return [...this._places];
    // Since _places is not an array anymore this is not how we get the value of the array.

    //This method now returns an observable that we can use to subscribe in different parts of the application
    return this._places.asObservable();
  }
  
  getPlace(id: string) {
    //This method now returns an observable that we can use to subscribe in different parts of the application
    return this.places.pipe(
      take(1), 
      map(places => {
        return {...places.find(p => p.id === id)}
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://data.whicdn.com/images/310015645/original.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
      
    );

    // this._places.push(newPlace);
    /* 
    since the _places is not an array anymore and is instead a BehaviorSubject, we call a method called .next()
    but before adding an element, we need first to grab the value of the whole array _places. 
    For that, we subscribe to places and use the pipe operator. Then we concatenate the latest place we just want to add
    Each observer can receive only three function: next, error and complete. For this example, it only receives the next function
      subscribe(
        (value) => {...}
        (error) => {...}
        (complete) => {...}
      )
    */
    this.places.pipe(take(1)).subscribe(
      places => {this._places.next(places.concat(newPlace))}
      )
  
  } // end addPlace
  
  constructor(
    private authService: AuthService
  ) { }



}
