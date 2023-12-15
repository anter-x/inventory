import { jsonObject, jsonMember } from 'typedjson';
import { Entity } from './entity';
import { Employee } from './employee';

@jsonObject
export class DestructionRecord implements Entity {
  @jsonMember
  public id!: string;

  @jsonMember({ serializer: (date) => date.toJSON(), deserializer: (json) => new Date(json) })
  public acceptedAt!: Date;

  @jsonMember
  public hdNumber!: string;

  @jsonMember
  public destractionNumber!: string;

  @jsonMember({ serializer: (employee) => employee.uid, deserializer: (id) => new Employee({ id }) })
  public whoPassed!: Employee;

  @jsonMember({ serializer: (employee) => employee.uid, deserializer: (id) => new Employee({ id }) })
  public whoAccepted!: Employee;

  public constructor(init?: Partial<DestructionRecord>) {
    Object.assign(this, init);
  }
}

export type DestructionRecordSnapshot = Pick<
  DestructionRecord,
  | 'id'
  | 'hdNumber'
  | 'destractionNumber'
> & {
  acceptedAt: string,
  whoPassed: string,
  whoAccepted: string
};
