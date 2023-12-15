import { Observable, from, map } from 'rxjs';
import {
    QueryOrderByConstraint,
    QueryFieldFilterConstraint,
    Query,
    query,
    limit,
    limitToLast,
    startAfter,
    endBefore,
    QueryDocumentSnapshot,
    getDocsFromServer,
} from '@angular/fire/firestore';
import { keepUnstableUntilFirst } from '@angular/fire';
import { collection as collection$ } from 'rxfire/firestore';
import { CursorType } from './collection-cursor-holder';

export class CollectionQuery<T> {
    constructor(private _query: Query<T>) {}

    get query(): Query<T> {
        return this._query;
    }

    filter(...filterBy: QueryFieldFilterConstraint[]): CollectionQuery<T> {
        this._query = query(this._query, ...filterBy);
        return this;
    }

    order(orderBy: QueryOrderByConstraint): CollectionQuery<T> {
        this._query = query(this._query, orderBy);
        return this;
    }

    limit(limitN: number): CollectionQuery<T> {
        this._query = query(this._query, limit(limitN));
        return this;
    }

    limitToLast(limitN: number): CollectionQuery<T> {
        this._query = query(this._query, limitToLast(limitN));
        return this;
    }

    startAfter(cursor: CursorType<T>): CollectionQuery<T> {
        if (cursor) {
            this._query = query(this._query, startAfter(cursor));
        }
        return this;
    }

    endBefore(cursor: CursorType<T>): CollectionQuery<T> {
        if (cursor) {
            this._query = query(this._query, endBefore(cursor));
        }
        return this;
    }

    docs(): Observable<QueryDocumentSnapshot<T>[]> {
        return collection$(this.query).pipe(
            // to trigger UI rendering when async pipe is subscribed again
            keepUnstableUntilFirst
        );
    }

    docsFromServer(): Observable<QueryDocumentSnapshot<T>[]> {
        return from(getDocsFromServer(this.query)).pipe(map((snapshot) => snapshot.docs));
    }
}
