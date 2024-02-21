import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CellValue } from '@shared/types/cell-value';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
	selector: 'data-row',
	templateUrl: './data-row.component.html',
	styleUrl: './data-row.component.css'
})
export class DataRowComponent implements OnInit, OnDestroy {
	@Input({ required: true }) rowData!: CellValue[];
	@Input() isEven = false;
	@Output() onUpdate = new EventEmitter<Record<string, string>>();

	private destroyed$ = new Subject < boolean > ();

	public editRowForm = new FormGroup({
		grade: new FormControl('', [Validators.required]),
		lastAttendedDate: new FormControl('')
	})

	ngOnInit(): void {
		this.editRowForm.patchValue({
			grade: this.rowData[6] as string,
			lastAttendedDate: this.rowData[7] as string
		});

		this.editRowForm.valueChanges
			.pipe(
				takeUntil(this.destroyed$),
				debounceTime(250),
				distinctUntilChanged()
			)
			.subscribe((changes: any) => {
				this.onUpdate.emit(changes);
			})
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}


}
