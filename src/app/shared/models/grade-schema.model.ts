interface GradeRange {
	grade: string,
	minimumPercentage: number,
	maximumPercentage: number,

}

export type WhichGradeType = "midterm" | "final";
export type GradeSchemaType = "A-F" | "CR/NC";

export class GradeSchema {
	private ranges: GradeRange[] = [];

	constructor(ranges: GradeRange[]) {
		this.ranges = ranges;
	}

	gradeForPercentage(p: number): string | undefined {
		let range = this.ranges.find((r: GradeRange) => {
			return p >= r.minimumPercentage && p < r.maximumPercentage;
		});
		if (!range) {
			return undefined;
		}
		return range.grade;
	}

}
