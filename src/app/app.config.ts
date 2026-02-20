import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

/**
 * Configuração da aplicação - Angular v20
 * 
 * Define providers globais usando a nova API funcional (sem módulos).
 * - provideZoneChangeDetection: Otimiza detecção de mudanças com event coalescing
 * - provideRouter: Sistema de rotas
 * - provideAnimations: Necessário para Angular Material (dialogs, snackbars, etc)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations()
  ]
};
