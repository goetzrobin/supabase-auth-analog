import '@angular/platform-server/init';
import 'zone.js/node';

import { InjectionToken, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { config } from './app/app.config.server';
import { AppComponent } from './app/app.component';
import { REQUEST, RESPONSE } from './request-response';

if (import.meta.env.PROD) {
  enableProdMode();
}

export function bootstrap() {
  return bootstrapApplication(AppComponent, config);
}

export default async function render(
  url: string,
  document: string,
  { req, res }: { req: Request; res: Response }
) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
    platformProviders: [
      { provide: REQUEST, useValue: req },
      { provide: RESPONSE, useValue: res },
    ],
  });

  return html;
}