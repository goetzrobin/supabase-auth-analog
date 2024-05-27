import {defineEventHandler, parseCookies} from 'h3'
import { authClient, authenticateUser } from '../../../auth'
export default defineEventHandler(async (event) => {
  const {data, error} = await authenticateUser(event);
    return { talks: [data] }
  })