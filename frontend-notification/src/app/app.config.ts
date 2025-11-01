import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
};
