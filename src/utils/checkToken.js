import { AuthenticationError } from 'apollo-server-core'

import { get_staff_by_id } from '#modules/staff/query'
import { verify } from './functions.js'
import db from './dbConnection.js'

export default async (token, userAgent) => {
    if (!token) throw new AuthenticationError('Token required!')
    const { agent, id } = verify(token)
    if (userAgent !== agent) throw new AuthenticationError("Token is sent from wrong device!")
    const staff = await db(get_staff_by_id, id)
    if (!staff.length) throw new AuthenticationError('You are not a member!')
    return staff
}