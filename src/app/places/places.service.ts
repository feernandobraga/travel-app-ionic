import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PlaceLocation } from "./location.model";

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  /* 
    BehaviorSubject is used with RxJS for creating Observables with default value (in this case our Place[] array)
    so we can subscribe to it.
    The logic behind it is: You create an observable here, for example, and the somewhere else you subscribe
    to the observable. This way, if the data stream changes, IONIC will display the changes properly.
    This fixes issues with cached pages/data 
  */
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    // return [...this._places];
    // Since _places is not an array anymore this is not how we get the value of the array.

    //This method now returns an observable that we can use to subscribe in different parts of the application
    return this._places.asObservable();
  }

  /* BEFORE HttpRequest
    getPlace(id: string) {
      //This method now returns an observable that we can use to subscribe in different parts of the application
      return this.places.pipe(
        take(1),
        map(places => {
          return { ...places.find(p => p.id === id) };
        })
      );
    } 
  */

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-course-travelapp.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        delay(500),
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  uploadImage(image: File) {
    const upLoadData = new FormData();
    upLoadData.append("image", image);

    return this.http.post<{ imageUrl: string; imagePath: string }>(
      "https://us-central1-ionic-course-travelapp.cloudfunctions.net/storeImage",
      upLoadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error("User not found");
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          dateFrom,
          dateTo,
          userId,
          location
        );
        return this.http.post<{ name: string }>(
          "https://ionic-course-travelapp.firebaseio.com/offered-places.json",
          { ...newPlace, id: null }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
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

    /* return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        this._places.next(places.concat(newPlace));
      })
    ); */
  } // end addPlace

  /* UpdatePlace BEFORE HttpRequests
  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  } // end updatePlace */

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        "https://ionic-course-travelapp.firebaseio.com/offered-places.json"
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places); // the 'of' function takes any value and wraps into a new observable
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://ionic-course-travelapp.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  } // end updatePlace
} // end PlacesService

/*  This is the old Place array, before implementing Http requests
[
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City",
      "https://lp-cms-production.imgix.net/2019-06/GettyImages-538096543_medium.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4",
      149.99,
      new Date("2019-01-01"),
      new Date("2019-12-13"),
      "abc"
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris!",
      "https://photos.mandarinoriental.com/is/image/MandarinOriental/paris-2017-home?$MO_masthead-property-mobile$",
      189.99,
      new Date("2019-01-01"),
      new Date("2019-12-13"),
      "abc"
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip",
      "https://data.whicdn.com/images/310015645/original.jpg",
      99.99,
      new Date("2019-01-01"),
      new Date("2019-12-13"),
      "abc"
    ),
  ] 
  */
