import { AuthClient, AuthChangeEvent } from '@supabase/auth-js'
import {H3Event, parseCookies} from 'h3'

const AUTH_URL = `${import.meta.env['VITE_SUPABASE_URL']!}/auth/v1`;
const AUTH_HEADERS = {
    Authorization: `Bearer ${import.meta.env['VITE_SUPABASE_KEY']!}`,
    apikey: `${import.meta.env['VITE_SUPABASE_KEY']!}`,
  }
export const authClient = new AuthClient({ headers: AUTH_HEADERS, url: AUTH_URL, fetch: fetch});
export type AuthClient = typeof authClient;
export type AuthState = AuthChangeEvent;

export const authenticateUser = async (event: H3Event) => {
    const cookies = parseCookies(event);
    await authClient.setSession({
      access_token: cookies['sb-access-token'],
      refresh_token: cookies['sb-refresh-token']
    })
    return await authClient.getUser()
}