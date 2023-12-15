import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, collection } from '@angular/fire/firestore';
import { GenericCollection } from './generic-collection';
import { Employee } from '../entity/employee';
import { EmployeeConverterService } from '../service/employee-converter.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCollectionService extends GenericCollection<Employee> {
  constructor(override firestore: Firestore) {
    super(firestore);
    this.initCollection();
  }

  protected initCollection(): void {
    this.collection = collection(this.firestore, 'employees') as CollectionReference<Employee>;
  }

  protected getConverter() {
    return new EmployeeConverterService();
  }
}
