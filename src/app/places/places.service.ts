import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place(
      'p1', 
      'Manhattan Mansion', 
      'In the heart of New York City',
      'https://lp-cms-production.imgix.net/2019-06/GettyImages-538096543_medium.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-13')
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://photos.mandarinoriental.com/is/image/MandarinOriental/paris-2017-home?$MO_masthead-property-mobile$',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-13')
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip',
      'https://data.whicdn.com/images/310015645/original.jpg',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-13')
    )
  ];

  get places(){
    return [...this._places];
  }
  
  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)}
    
    
  }
  
  constructor() { }



}
