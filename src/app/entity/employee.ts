import { jsonObject, jsonMember } from 'typedjson';
import { Entity } from './entity';

@jsonObject
export class Employee implements Entity {
  @jsonMember
  public id!: string;

  @jsonMember(String)
  public displayName!: string | null;

  public constructor(init?: Partial<Employee>) {
    Object.assign(this, init);
  }
}

export type EmployeeSnapshot = Pick<
    Employee,
    | 'id'
    | 'displayName'
>;
