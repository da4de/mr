import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { providePrimeNG } from "primeng/config"
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiPrefixInterceptor } from './core/interceptors/api-prefix.interceptor';
import Aura from "@primeng/themes/aura"

/** Global Angular application configuration */
export const appConfig: ApplicationConfig = {
  providers: [
    /* Configure HTTP client */
    provideHttpClient(
      withFetch(),
      withInterceptors([apiPrefixInterceptor])
    ),
    /* zone.js change detection */
    provideZoneChangeDetection({ eventCoalescing: true }),
    /* async animations */
    provideAnimationsAsync(),
    /* PrimeNG custom theme */ 
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
