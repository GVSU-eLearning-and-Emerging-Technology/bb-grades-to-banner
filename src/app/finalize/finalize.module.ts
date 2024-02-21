import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalizeRoutingModule } from './finalize-routing.module';
import { FinalizePageComponent } from './finalize-page/finalize-page.component';
import { DataRowComponent } from './data-row/data-row.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
	declarations: [
		FinalizePageComponent,
		DataRowComponent
	],
	imports: [
		SharedModule,
		CommonModule,
		FinalizeRoutingModule
	]
})
export class FinalizeModule {}
