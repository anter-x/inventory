import 'core-js/proposals/reflect-metadata';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseAppModule } from '@angular/fire/app';
import { FirestoreModule } from '@angular/fire/firestore';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { combineLatest, EMPTY, filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { EmployeesCollectionService } from './collection/employees-collection.service';
import { Employee } from './entity/employee';
import { DestructionRecordsCollection } from './collection/destruction-records-collection.service';
import { DestructionRecord } from './entity/destruction-record';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FirebaseAppModule, FirestoreModule, MatDividerModule, MatButtonModule, MatInputModule, MatIconModule, MatTabsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inventory';

  private destroyed$ = new Subject<void>();
  private addEmployee$ = new Subject<string>();
  public employeeForm = this.fb.group({
    displayName: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'blur',
      },
    ],
  });
  public employees$!: Observable<Employee[]>;
  public destractionRecords$!: Observable<DestructionRecord[]>;

  constructor(
    private fb: FormBuilder,
    private employees: EmployeesCollectionService,
    private destractionRecords: DestructionRecordsCollection
  ) { }

  ngOnInit(): void {
    this.addEmployee$.pipe(
      takeUntil(this.destroyed$),
      switchMap((displayName) => this.employees.add(new Employee({ displayName }))),
    ).subscribe();

    this.employees$ = this.employees.items().pipe(
      takeUntil(this.destroyed$)
    );

    this.destractionRecords$ = this.destractionRecords.items().pipe(
      takeUntil(this.destroyed$),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addEmployee(event: Event) {
    event.stopPropagation();
    if (!this.employeeForm.valid) {
      return;
    }

    this.addEmployee$.next(this.employeeForm.get('displayName')?.value as string);
    this.employeeForm.reset();
  }

  removeEmployee(id: string) {
    this.employees.delete(id).subscribe();
  }
}
