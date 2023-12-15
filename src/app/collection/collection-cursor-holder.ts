import { DocumentSnapshot } from '@angular/fire/firestore';

export type CursorType<T> = DocumentSnapshot<T> | string | null;
export interface CursorHolder<T> {
    getNextCursor(): CursorType<T>;
    getPrevCursor(): CursorType<T>;
}
