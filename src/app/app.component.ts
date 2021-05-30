import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, timeout } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'pending-write-error';
  onGoingOperationCount = 0

  hasPendingWrites$ = new Subject<boolean>()
  hugeDoc$: Observable<any>
  smallDoc$: Observable<any>
  smallDocDb$: Observable<any>

  private hugeObject: any

  constructor(
    public afs: AngularFirestore
  ) {
    (window as any).fs = this.afs.firestore
  }

  ngOnInit() {
    setTimeout(() => this.updateHasPendingWrites(), 1500);

    this.hugeDoc$ = this.afs.doc('docs/huge').valueChanges()
    this.smallDoc$ = this.afs.doc('docs/small').valueChanges()

    this.smallDocDb$ = this.afs.doc('docs/small').snapshotChanges().pipe(
      filter(snap => !snap.payload.metadata.hasPendingWrites && !snap.payload.metadata.fromCache),
      map(snap => snap.payload.data())
    )

  }

  saveDoc(type: 'huge' | 'small') {
    const docToSave = type == 'huge' ?
      this.generateHugeObject() :
      { value: Math.random().toString().substr(5) }

    this.onGoingOperationCount++

    this.afs.collection("docs")
      .doc(type)
      .set(docToSave)
      .then(result => {
        console.log(type, "doc save successful", result)
        this.onGoingOperationCount--
        this.updateHasPendingWrites()
      })
      .catch(er => {
        console.log(type, "doc save failed", er)
        this.onGoingOperationCount--
        this.updateHasPendingWrites()
      })
    this.updateHasPendingWrites()
  }

  updateHasPendingWrites() {
    this.hasPendingWrites$.next(null)
    from(this.afs.firestore.waitForPendingWrites())
      .pipe(
        map(() => false),
        timeout(2_000),
        catchError(() => of(true))
      )
      .subscribe(val => this.hasPendingWrites$.next(val))
  }

  private generateHugeObject() {
    if (this.hugeObject) {
      this.hugeObject.value = Math.random().toString().substr(5)
      return this.hugeObject
    }

    this.hugeObject = {}
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 1_100_00 / 2; j++) {
        this.hugeObject[`value${j}`] ??= ""
        this.hugeObject[`value${j}`] += "a"
      }
    }
    this.hugeObject.value = Math.random().toString().substr(5)
    return this.hugeObject
  }

}
