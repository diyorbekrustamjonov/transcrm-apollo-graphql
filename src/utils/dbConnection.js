import { UserInputError } from 'apollo-server-core'
import pg from 'pg'

const pool = new pg.Pool({
    port: process.env.PG_PORT,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
})

export default async function (query, ...params) {
    const client = await pool.connect()
    try {
        const { rows } = await client.query(query, params)
        return rows
    } catch (error) {
        console.log('Database error:', error.message)
        throw new UserInputError(error.message)
    } finally {
        client.release()
    }
}