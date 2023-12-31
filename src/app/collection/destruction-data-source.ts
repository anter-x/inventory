import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, catchError, forkJoin, map, mergeMap, of } from 'rxjs';
import { DestructionRecord } from '../entity/destruction-record';
import { DestructionRecordsCollection } from './destruction-records-collection.service';
import { EmployeesCollectionService } from './employees-collection.service';

@Injectable({
  providedIn: 'root',
})
export class DestructionDataSource extends DataSource<DestructionRecord> {

  constructor(
    private destractionRecords: DestructionRecordsCollection,
    private employees: EmployeesCollectionService
  ) {
    super();
  }

  connect(): Observable<DestructionRecord[]> {
    return this.destractionRecords.items().pipe(
      mergeMap((destractionRecords) => this.assignWhoPassed(destractionRecords)),
      mergeMap((destractionRecords) => this.assignWhoAccepted(destractionRecords)),
    );
  }

  disconnect() { }

  private assignWhoPassed(destructionRecords: DestructionRecord[]): Observable<DestructionRecord[]> {
    if (destructionRecords.length === 0) {
      return new Observable<DestructionRecord[]>((observer) => observer.next([]));
    }

    return forkJoin(
      destructionRecords.map((destructionRecord) => {
        return this.employees.get(destructionRecord.whoPassed.id).pipe(
          map((employee) => {
            destructionRecord.whoPassed = employee;
            return destructionRecord;
          }),
          catchError(() => {
            destructionRecord.whoPassed.displayName = 'undefined';
            return of(destructionRecord);
          })
        );
      })
    );
  }

  private assignWhoAccepted(destructionRecords: DestructionRecord[]): Observable<DestructionRecord[]> {
    if (destructionRecords.length === 0) {
      return new Observable<DestructionRecord[]>((observer) => observer.next([]));
    }

    return forkJoin(
      destructionRecords.map((destructionRecord) => {
        return this.employees.get(destructionRecord.whoAccepted.id).pipe(
          map((employee) => {
            destructionRecord.whoAccepted = employee;
            return destructionRecord;
          }),
          catchError(() => {
            destructionRecord.whoAccepted.displayName = 'undefined';
            return of(destructionRecord);
          })
        );
      })
    );
  }
}
