import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import { injectSupabaseAuth } from './auth.service';
import { injectSSRCookies } from './ssr-cookie.service';
import { Session } from '@supabase/auth-js';

@Component({
  selector: 'analog-app-root',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  template: ` 
  <div [class.invisible]="!session()" class="p-4 text-sm font-medium tracking tight flex justify-between items-center border-b border-border">
    <a routerLink='protected'>Protected</a>
  <button (click)="signOut()">Sign Out</button>
  </div>
  <router-outlet/>`,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly auth = injectSupabaseAuth();
  private readonly cookies = injectSSRCookies();
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID))
protected readonly session = signal<Session | null>(null);
  constructor() {
    if (!this.isBrowser) return;
    this.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
      if (!session) return

      // Use cookies to share session state between server and client
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.cookies.set('sb-access-token', session?.access_token)
        this.cookies.set('sb-refresh-token', session?.refresh_token)
        if (session.provider_token) {
          this.cookies.set('sb-provider-token', session.provider_token)
        }
        if (session.provider_refresh_token) {
          this.cookies.set('sb-provider-refresh-token', session.provider_refresh_token)
        }
        this.router.navigate(['protected'])
      }
      if (event === 'SIGNED_OUT') {
        this.cookies.delete('sb-access-token')
        this.cookies.delete('sb-refresh-token')
        this.cookies.delete('sb-provider-token')
        this.cookies.delete('sb-provider-refresh-token')
      }
    })
  }

  async signOut() {
    await this.auth.signOut();
    await this.router.navigateByUrl('/')
  }
}
