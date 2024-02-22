import { Injectable } from '@angular/core';
import { GradeSchema } from '@models/grade-schema.model';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationService {
	public appNameFull = "BbGradesToBanner";
	public appNameShort = "BbGradesToBanner";
	public appVersionText = "v1.0.0";


	public defaultGradeSchema = new GradeSchema([
		{
			grade: "F",
			minimumPercentage: 0,
			maximumPercentage: 64
		},
		{
			grade: "D",
			minimumPercentage: 64,
			maximumPercentage: 67
		},
		{
			grade: "D+",
			minimumPercentage: 67,
			maximumPercentage: 70
		},
		{
			grade: "C-",
			minimumPercentage: 70,
			maximumPercentage: 74
		},
		{
			grade: "C",
			minimumPercentage: 74,
			maximumPercentage: 77
		},
		{
			grade: "C+",
			minimumPercentage: 77,
			maximumPercentage: 80
		},
		{
			grade: "B-",
			minimumPercentage: 80,
			maximumPercentage: 84
		},
		{
			grade: "B",
			minimumPercentage: 84,
			maximumPercentage: 87
		},
		{
			grade: "B+",
			minimumPercentage: 87,
			maximumPercentage: 90
		},
		{
			grade: "A-",
			minimumPercentage: 90,
			maximumPercentage: 94
		},
		{
			grade: "A",
			minimumPercentage: 94,
			maximumPercentage: 100
		},
	]);


	constructor() {}
}
