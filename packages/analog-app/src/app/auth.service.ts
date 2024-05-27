import { InjectionToken, Provider, inject } from '@angular/core';
import { AuthClient, authClient } from '../auth';

const SUPABASE_AUTH_TOKEN = new InjectionToken<AuthClient>('Supabase Auth Client');

// Setting up the provider using the same token instance
export const provideSupabaseAuth = (): Provider[] => ([{provide: SUPABASE_AUTH_TOKEN, useFactory: () => {
    return authClient
}}]);
export const injectSupabaseAuth = () => inject(SUPABASE_AUTH_TOKEN);
export {AuthState} from '../auth'