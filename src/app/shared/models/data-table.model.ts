import { trimQuotes } from "@functions/string-utils";
import { CellValue } from '@shared/types/cell-value';
import { DataRowRecord } from "@shared/types/data-row-record";

export class DataTable {
	public rawData: string | CellValue[][] = "";
	public fileName: string | null = null;
	public fieldNames: CellValue[] = [];
	public rows: CellValue[][] = [];

	constructor(raw: string | CellValue[][]) {
		this.rawData = raw;
		if (Array.isArray(raw)) {
			if (raw.length > 0) {
				this.fieldNames = (raw as CellValue[][]).shift()!;
			} else {
				this.fieldNames = [];
			}
			this.rows = raw;
		} else {
			let allLines: string[] = raw.trim().split("\n");
			let rawFieldNames = allLines.shift();
			this.fieldNames = rawFieldNames?.split("\t").map((x: string) => {
				return trimQuotes(x).replace(/ \[[^\]]+\] \|\d+$/, "");
			}) ?? [];
			this.rows = allLines?.map((line: string) => {
				return line.split("\t").map((x: string) => {
					return trimQuotes(x);
				}) ?? [];
			}) ?? [];
		}
	}

	setFileName(f: string) {
		this.fileName = f;
	}

	addField(name: string) {
		if (!this.fieldIndex(name)) {
			this.fieldNames.push(name);
		}
	}

	row(n: number): CellValue[] | undefined {
		return this.rows.at(n);
	}

	column(n: number): CellValue[] {
		return this.rows.map((r: CellValue[]) => {
			return r.at(n) ?? "";
		});
	}

	hasField(f: string): boolean {
		return this.fieldNames.includes(f);
	}

	fieldIndex(f: string): number | undefined {
		const n = this.fieldNames.indexOf(f);
		if (n == -1) {
			return undefined;
		}
		return n;
	}

	field(f: string): CellValue[] | undefined {
		const n = this.fieldIndex(f);
		if (n == -1) {
			return undefined;
		}
		return this.column(n!);
	}

	filter(fn: (x: CellValue[]) => boolean): DataTable {
		let filtered = new DataTable([this.fieldNames, ...this.rows.filter(fn)]);
		return filtered;
	}

	toMap(keyField: string, fields: string[]): DataRowRecord  {
		const keyIndex = this.fieldIndex(keyField);
		if (!keyIndex) {
			return {};
		}
		return Object.fromEntries(this.rows.map((x: CellValue[]) => {
			return [x.at(keyIndex), Object.fromEntries(fields.map((f: string) => {
				const fieldIndex = this.fieldIndex(f);
				return [f, x.at(fieldIndex!) ?? null];
			}))];
		}));
	}

	mergeWithRecords(keyField: string, data: DataRowRecord): DataTable {
		let newTable = new DataTable([this.fieldNames, ...this.rows]);
		const keyIndex = newTable.fieldIndex(keyField);
		if (!keyIndex) {
			return newTable;
		}
		const allKeyValues = newTable.column(keyIndex);


		Object.entries(data).forEach(([recordKey, recordData]) => {
			const recordRow = allKeyValues.indexOf(recordKey);
			if (recordRow == -1) {
				 // TODO: add these new rows to the table
			} else {

				Object.entries(recordData).forEach(([fieldName, fieldValue]) => {
					if (!newTable.hasField(fieldName)) {
						newTable.addField(fieldName);
					}
					const fieldIndex = newTable.fieldIndex(fieldName);
					newTable.rows[recordRow][fieldIndex!] = fieldValue;
				});
			}
		});

		return newTable;
	}

	copyFromColumnToColumn(fromField: string, toField: string): DataTable {
		let newTable = new DataTable([this.fieldNames, ...this.rows]);
		const fromIndex = newTable.fieldIndex(fromField);
		const toIndex = newTable.fieldIndex(toField);
		if ((fromIndex == -1) || (toIndex == -1)) {
			return newTable;
		}

		newTable.rows = newTable.rows.map((row: CellValue[]): CellValue[] => {
			let newRow = [...row];
			newRow[toIndex as number] = newRow[fromIndex as number];

			return newRow;
		});

		return newTable;
	}

	updateCell(row: number, column: number, value: CellValue) {
		this.rows[row][column] = value;
	}

	transformField(fieldName: string, fn: (x: CellValue) => CellValue): DataTable {
		const index = this.fieldIndex(fieldName);
		if (index !== undefined) {
			this.rows = this.rows.map((r: CellValue[]): CellValue[] => {
				let newRow = [...r];
				newRow[index] = fn(newRow[index]);
				return newRow;
			});
		}
		return this;
	}

	export(): any[][] {
		return [
			this.fieldNames.map((v) => ({
				value: v
			})),
			...this.rows.map((r: CellValue[]): any[] => {
				return r.map((v) => ({
					value: v
				}))
			})
		];
	}

	omit(fields: string[]): DataTable {
		let newTable = new DataTable([this.fieldNames, ...this.rows]);
		fields.forEach((f: string) => {
			const index = newTable.fieldIndex(f);
			if (index !== undefined) {
				newTable.fieldNames.splice(index, 1);
				newTable.rows = newTable.rows.map((r: CellValue[]): CellValue[] => {
					let newRow = [...r];
					newRow.splice(index, 1);
					return newRow;
				});
			}
		})
		return newTable;
	}
}
