import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { LoaderModule } from './loader/loader.module';
import { DataService } from '@services/data.service';
import { FinalizeModule } from './finalize/finalize.module';
import { ConfigurationService } from '@services/configuration.service';


@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SharedModule,
		CoreModule,
		FinalizeModule,
		LoaderModule,
	],
	providers: [
		DataService,
		ConfigurationService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
