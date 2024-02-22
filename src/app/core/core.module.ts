import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { ToasterComponent } from './toaster/toaster.component';
import { ToastComponent } from './toast/toast.component';



@NgModule({
	declarations: [
		PageFooterComponent,
		ToasterComponent,
		ToastComponent
	],
	imports: [
		CommonModule
	],
	exports: [
		PageFooterComponent,
		ToasterComponent,
		ToastComponent
	]
})
export class CoreModule {}
