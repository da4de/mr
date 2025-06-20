import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { providePrimeNG } from "primeng/config"
import Aura from "@primeng/themes/aura"
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiPrefixInterceptor } from '../http/api.prefix.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([apiPrefixInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none'
        }
      }
    })
  ]
};
