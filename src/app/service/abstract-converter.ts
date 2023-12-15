import { TypedJSON, Serializable } from 'typedjson';

export abstract class AbstractConverter<T> {
  private serializer!: TypedJSON<T>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract toFirestore(user: T): { [key: string]: any };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract fromFirestore(data: { [key: string]: any }): T;

  protected getSerializer(serializable: Serializable<T>): TypedJSON<T> {
    if (!this.serializer) {
      this.serializer = new TypedJSON(serializable, {
        preserveNull: true,
      });
    }
    return this.serializer;
  }
}
