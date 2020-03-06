import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TableComponent} from './components/table/table.component';
import {DsdModule} from '../../../dsd/src/lib/dsd.module';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DsdModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
