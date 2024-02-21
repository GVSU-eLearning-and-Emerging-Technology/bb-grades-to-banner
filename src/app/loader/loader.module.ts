import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderRoutingModule } from './loader-routing.module';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { BlackboardLoaderComponent } from './blackboard-loader/blackboard-loader.component';
import { GradeColumnChooserPageComponent } from './grade-column-chooser-page/grade-column-chooser-page.component';
import { BannerLoaderComponent } from './banner-loader/banner-loader.component';


@NgModule({
  declarations: [
    LoadingPageComponent,
    BlackboardLoaderComponent,
    GradeColumnChooserPageComponent,
    BannerLoaderComponent
  ],
  imports: [
    CommonModule,
    LoaderRoutingModule
  ]
})
export class LoaderModule { }
