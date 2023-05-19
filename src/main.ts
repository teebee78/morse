import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { EncodeComponent } from './app/encode/encode.component';
import { DecodeComponent } from './app/decode/decode.component';
import { RoundTripComponent } from './app/round-trip/round-trip.component';
import { InjectionToken } from '@angular/core';

export const DOT_DURATION_IN_MS = new InjectionToken<number>('DOT_DURATION_IN_MS');

bootstrapApplication(AppComponent, {
  providers: [
    { provide: DOT_DURATION_IN_MS, useValue: 75},
    provideRouter([
      { path: 'encode', component: EncodeComponent },
      { path: 'decode', component: DecodeComponent },
      { path: 'round-trip', component: RoundTripComponent},
      { path: '', redirectTo: '/encode', pathMatch: 'full' }
    ])
  ]
});