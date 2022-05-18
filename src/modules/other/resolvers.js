import format from 'pg-format'

import { get_colors, get_districts } from './query.js';
import db from '#utils/dbConnection';


export default {
    Query: {
        colors: async () => await db(get_colors),
        districts: async (_, { city, search, sort }) => {
            const data = await db(get_districts, search, sort, city ? city : null)
            return data
        }
    }
}