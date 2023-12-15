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
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { combineLatest, EMPTY, filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { EmployeesCollectionService } from './collection/employees-collection.service';
import { Employee } from './entity/employee';
import { DestructionRecordsCollection } from './collection/destruction-records-collection.service';
import { DestructionRecord } from './entity/destruction-record';
import { DestructionDataSource } from './collection/destruction-data-source';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FirebaseAppModule, FirestoreModule, MatDividerModule, MatButtonModule, MatInputModule, MatIconModule, MatTabsModule, MatTableModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inventory';

  private destroyed$ = new Subject<void>();
  private addEmployee$ = new Subject<string>();
  private addDestructionRecord$ = new Subject<DestructionRecord>();
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

  public destructionForm = this.fb.nonNullable.group({
    hdNumber: ['', Validators.required],
    whoPassed: ['', Validators.required],
    whoAccepted: ['', Validators.required],
    destractionNumber: ['', Validators.required],
    description: ['']
  });

  public displayedColumns: string[] = ['acceptedAt', 'hdNumber', 'whoPassed', 'whoAccepted', 'destractionNumber', 'description'];

  constructor(
    private fb: FormBuilder,
    private employees: EmployeesCollectionService,
    private destructionRecords: DestructionRecordsCollection,
    public destructionDataSource: DestructionDataSource
  ) { }

  ngOnInit(): void {
    this.addEmployee$.pipe(
      takeUntil(this.destroyed$),
      switchMap((displayName) => this.employees.add(new Employee({ displayName }))),
    ).subscribe();

    this.employees$ = this.employees.items().pipe(
      takeUntil(this.destroyed$)
    );

    this.addDestructionRecord$.pipe(
      takeUntil(this.destroyed$),
      switchMap((destructionRecord) => this.destructionRecords.add(destructionRecord)),
    ).subscribe();
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

  addDestructionRecord() {
    if (!this.destructionForm.valid) {
      return;
    }

    const destruction = new DestructionRecord({
      acceptedAt: new Date(),
      hdNumber: this.destructionForm.value.hdNumber,
      whoPassed: new Employee({ id: this.destructionForm.value.whoPassed }),
      whoAccepted: new Employee({ id: this.destructionForm.value.whoAccepted }),
      destractionNumber: this.destructionForm.value.destractionNumber,
      description: this.destructionForm.value.description
    });

    this.addDestructionRecord$.next(destruction);
    this.destructionForm.reset();
  }
}
