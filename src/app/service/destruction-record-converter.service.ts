import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Employee, EmployeeSnapshot } from '../entity/employee';
import { AbstractConverter } from './abstract-converter';
import { DestructionRecord, DestructionRecordSnapshot } from '../entity/destruction-record';

export class DestructionRecordConverterService extends AbstractConverter<DestructionRecord> implements FirestoreDataConverter<DestructionRecord> {
  toFirestore(destractionRecord: DestructionRecord): DocumentData {
    const plainJson = this.getSerializer(DestructionRecord).toPlainJson(destractionRecord);
    if (plainJson) {
      return plainJson as unknown as DestructionRecordSnapshot;
    }
    throw new Error('Can not convert destractionRecord to json');
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): DestructionRecord {
    const destractionRecord = this.getSerializer(DestructionRecord).parse(snapshot.data());
    if (destractionRecord) {
      return destractionRecord;
    }
    throw new Error('Can not convert from json to destractionRecord');
  }
}
