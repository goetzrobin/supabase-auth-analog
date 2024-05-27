import { Component, effect, inject, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { LoadResult, RouteMeta } from '@analogjs/router';
import { authenticationGuard } from '../auth.guard';
import { load } from './protected.server';

export const routeMeta: RouteMeta = {
    title: 'Protected Route',
    canActivate: [authenticationGuard()],
  };
  
@Component({
  selector: 'analog-app-protected',
  standalone: true,
  imports: [JsonPipe],
  host: {class: 'p-20 flex items-center space-x-4'},
  template: `
<p class="text-xl">Hello, {{load()?.user?.user_metadata?.['name']}}!</p>
  <img class="h-14 w-14 border border-border rounded-full" [src]="load()?.user?.user_metadata?.['avatar_url']"/>`
})
export default class ProtectedComponent {
  protected readonly load = input<LoadResult<typeof load>>();
}

