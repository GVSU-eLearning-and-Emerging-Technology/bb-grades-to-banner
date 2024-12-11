export const validGrades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F", "I", "W", "CR", "NC"];

export function areGradeAndDateValid(grade: string, date:string, errors: object = {}): boolean {
	if (/^(F|NC)$/i.test(grade) && !/\d/.test(date)) {
		if (!!errors) {
			(errors as any).dateNeeded = true;
		}
	}
	if (!!date && !/\d{1,2}\/\d{2}\/\d{4}/.test(date)) {
		if (!!errors) {
			(errors as any).invalidDate = true;
		}
	}
	if (!!grade && !validGrades.includes(grade)) {
		if (!!errors) {
			(errors as any).invalidGrade = true;
		}
	}
	if (!!grade && grade.match(/^$/)) {
		if (!!errors) {
			(errors as any).emptyGrade = true;
		}

	}
	return Object.keys(errors).length == 0;
}
