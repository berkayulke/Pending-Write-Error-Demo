import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDWi2kIq4uZ6XypZRUUBrWlMX0irKkMpp8",
      authDomain: "pending-write-error.firebaseapp.com",
      projectId: "pending-write-error",
      storageBucket: "pending-write-error.appspot.com",
      messagingSenderId: "893033140516",
      appId: "1:893033140516:web:96b3a764892e78d9ee63b1"
    }),
    AngularFirestoreModule.enablePersistence()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
