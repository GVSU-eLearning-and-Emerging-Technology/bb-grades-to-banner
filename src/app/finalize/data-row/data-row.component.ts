import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CellValue } from '@shared/types/cell-value';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { gradeDateValidator } from '@shared/validators/grade-date-validator.directive';

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
	}, { validators: gradeDateValidator})

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
				if (/[a-z]/.test(changes['grade'])) {
					this.editRowForm.get('grade')?.setValue((changes['grade'] as string).toUpperCase(), {emitEvent: false});
				}
				if (/–/.test(changes['grade'])) {
					this.editRowForm.get('grade')?.setValue((changes['grade'] as string).replace(/–/, "-"), {emitEvent: false});
				}
				if (/\s/.test(changes['grade'])) {
					this.editRowForm.get('grade')?.setValue((changes['grade'] as string).replaceAll(/\s/g, ""), {emitEvent: false});
				}

				// if (/^F$/i.test(changes['grade']) && !/\d/.test(changes['lastAttendedDate'])) {
				// 	this.editRowForm.get('lastAttendedDate')?.setErrors
				// }
				this.onUpdate.emit(changes);
			})
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}


}
