import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { DsdModule, ENVIRONMENT } from 'dsd';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { environment } from '../environments/environment';
import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HeaderComponent,
    HomeComponent,
    FormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DsdModule,
    DsdModule,
  ],
  providers: [
    {provide: ENVIRONMENT, useValue: environment},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
