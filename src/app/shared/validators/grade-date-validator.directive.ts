import { inject } from '@angular/core';
import { ConfigurationService } from '@services/configuration.service';

import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const gradeDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const validGrades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F", "I", "W", "CR", "NC"];

	const grade = control.get('grade');
	const lastAttendedDate = control.get('lastAttendedDate');
	let errors = {};

	if (/^(F|NC)$/i.test(grade?.value) && !/\d/.test(lastAttendedDate?.value)) {
		errors = {...errors, dateNeeded: true };
	}
	if (!!lastAttendedDate?.value && !/\d{1,2}\/\d{2}\/\d{4}/.test(lastAttendedDate?.value)) {
		errors = {...errors, invalidDate: true };
	}
	if (!!grade?.value && !validGrades.includes(grade?.value)) {
		errors = {...errors, invalidGrade: true };
	}

	return Object.keys(errors).length > 0 ? errors : null;
};
