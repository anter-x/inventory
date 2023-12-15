import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, collection } from '@angular/fire/firestore';
import { GenericCollection } from './generic-collection';
import { DestructionRecord } from '../entity/destruction-record';
import { DestructionRecordConverterService } from '../service/destruction-record-converter.service';

@Injectable({
  providedIn: 'root',
})
export class DestructionRecordsCollection extends GenericCollection<DestructionRecord> {
  constructor(override firestore: Firestore) {
    super(firestore);
    this.initCollection();
  }

  protected initCollection(): void {
    this.collection = collection(this.firestore, 'destruction_records').withConverter(this.getConverter()) as CollectionReference<DestructionRecord>;
  }

  protected getConverter() {
    return new DestructionRecordConverterService();
  }
}
