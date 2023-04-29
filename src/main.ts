import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { EncodeComponent } from './app/encode/encode.component';
import { DecodeComponent } from './app/decode/decode.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: 'encode', component: EncodeComponent },
      { path: 'decode', component: DecodeComponent },
      { path: '', redirectTo: '/encode', pathMatch: 'full' }
    ])
  ]
});