import {
  Firestore,
  FirestoreDataConverter,
  CollectionReference,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentReference,
  DocumentSnapshot,
  deleteDoc,
  query,
  QueryOrderByConstraint,
  QueryFieldFilterConstraint,
  UpdateData,
} from '@angular/fire/firestore';
import { collection as collection$, doc as doc$ } from 'rxfire/firestore';
import { Observable, defer, map, mergeMap, of, switchMap } from 'rxjs';
import { Entity } from '../entity/entity';
import { keepUnstableUntilFirst } from '@angular/fire';
import { CollectionQuery } from './collection-query';

export abstract class GenericCollection<T extends Entity> {
  protected collection!: CollectionReference<T>;

  constructor(protected firestore: Firestore) {}

  protected abstract initCollection(): void;

  public add(item: T): Observable<DocumentReference<T>> {
      const docRef = this.createDocument(this.generateId());
      item = this.beforeCreate(item);
      item.id = docRef.id;

      return defer(() => setDoc(docRef, item)).pipe(map(() => docRef));
  }

  public delete(id: string): Observable<void> {
      const itemRef = this.createDocument(id);
      return defer(() => deleteDoc(itemRef));
  }

  public update(item: T): Observable<void> {
      const itemRef = this.createDocument(item.id);
      let sanitizedItem = <UpdateData<T>>{ ...item };
      if (this.getConverter()) {
          sanitizedItem = <UpdateData<T>>this.getConverter().toFirestore(item);
      }
      return defer(() => updateDoc(itemRef, sanitizedItem));
  }

  public addIfNotExists(item: T, id: string): Observable<void | null> {
      return this.find(id).pipe(
          mergeMap((docSnapshot) => {
              const docRef = docSnapshot.ref;
              if (!docSnapshot.exists()) {
                  item = this.beforeCreate(item);
                  return defer(() => setDoc(docRef, item));
              }
              return of(null);
          })
      );
  }

  public addOrRewrite(item: T, id: string): Observable<void> {
      const itemRef = this.createDocument(id);
      item = this.beforeCreate(item);
      return defer(() => setDoc(itemRef, item));
  }

  public find(id: string): Observable<DocumentSnapshot<T>> {
      return defer(() => getDoc(this.createDocument(id)));
  }

  public find$(id: string): Observable<DocumentSnapshot<T>> {
      return doc$(this.createDocument(id));
  }

  public get(id: string): Observable<T> {
      return this.find(id).pipe(
          map((docSnap) => {
              if (!docSnap.exists()) {
                this.throwError(`The document with ID "${id}" is not exists`);
              }
              return docSnap.data() as T;
          })
      );
  }

  public get$(id: string): Observable<T> {
      return this.find$(id).pipe(
          map((docSnap) => {
              if (docSnap.exists()) {
                this.throwError(`The document with ID "${id}" is not exists`);
              }
              return docSnap.data() as T;
          }),
          // to trigger UI rendering when async pipe is subscribed again
          keepUnstableUntilFirst
      );
  }

  public items(orderBy?: QueryOrderByConstraint): Observable<T[]> {
      const collectionQuery = orderBy ? query(this.collection, orderBy) : this.collection;
      return collection$(collectionQuery).pipe(
          map((snapshots) => snapshots.map((snapshot) => snapshot.data())),
          // to trigger UI rendering when async pipe is subscribed again
          keepUnstableUntilFirst
      );
  }

  public filter(...filterBy: QueryFieldFilterConstraint[]): Observable<T[]> {
      return collection$(query(this.collection, ...filterBy)).pipe(
          map((snapshots) => snapshots.map((snapshot) => snapshot.data())),
          // to trigger UI rendering when async pipe is subscribed again
          keepUnstableUntilFirst
      );
  }

  public query(): CollectionQuery<T> {
      return new CollectionQuery(this.collection);
  }

  public createDocument(id: string): DocumentReference<T> {
      return doc(this.collection, id).withConverter(this.getConverter());
  }

  protected generateId(): string {
      return doc(this.collection).id;
  }

  protected beforeCreate(item: T): T {
      return item;
  }

  protected abstract getConverter(): FirestoreDataConverter<T>;

  protected throwError(message: string) {
      throw new Error(message);
  }
}
