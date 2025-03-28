import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CountryComponent } from './pages/country/country.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgChartsModule } from 'ng2-charts';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, HomeComponent, CountryComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, NgChartsModule],
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
