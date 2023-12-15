import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Employee, EmployeeSnapshot } from '../entity/employee';
import { AbstractConverter } from './abstract-converter';

export class EmployeeConverterService extends AbstractConverter<Employee> implements FirestoreDataConverter<Employee> {

  toFirestore(employee: Employee): DocumentData {
    const plainJson = this.getSerializer(Employee).toPlainJson(employee);
    if (plainJson) {
      return plainJson as unknown as EmployeeSnapshot;
    }
    throw new Error('Can not convert employee to json');
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): Employee {
    const employee = this.getSerializer(Employee).parse(snapshot);
    if (employee) {
      return employee;
    }
    throw new Error('Can not convert from json to employee');
  }
}
