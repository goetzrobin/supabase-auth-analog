import {authenticateUser} from '../../auth'
import { PageServerLoad } from '@analogjs/router';

export const load = async ({event}: PageServerLoad) => {
    console.log('loading')
  const {data, error} = await authenticateUser(event);
  console.log(data)
    return data;
  }