import { UserInputError } from 'apollo-server-core'
import format from 'pg-format'

import { check_staff_permission, get_staff } from './query.js'

import check_token from '#utils/checkToken' 
import db from '#utils/dbConnection'

import { add_branch, update_branch, delete_branch } from '#modules/branch/query'
import { check_permission, check_all_permission } from '#modules/permission/query'

export default {
    Query: {
        staff: async (_, { branch, search, sort }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            let rows = (await db(check_staff_permission, staff.staff_id, 2)).map(row => row.branch)
            if (branch) {
                if (rows.includes(+branch)) {
                    rows = [ branch ]
                } else {
                    throw new UserInputError('you have no right to the selected branch')
                }
            } 
            const sort_key = Object.keys(sort || {})[0]
            const staffs = await db(format(get_staff, rows.length ? rows : null), search, sort_key, sort?.[sort_key])
            return staffs.map(staff => {
                staff.gender = {
                    gender_id: staff.gender_id,
                    gender_name: staff.gender_name
                } 
                staff.staff_branch = {
                    branch_id: staff.branch_id,
                    branch_name: staff.branch_name,
                    address: {
                        city: staff.city_name,
                        district: staff.district_name
                    }
                }
                return staff
            }) 
        }
    },
    Mutation: {
        changeBranch: async (_, { branch_id, input: { branch_district, branch_name } }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            const checkPermission = await db(check_all_permission, staff.staff_id, branch, 2, 4)
            if (!checkPermission.length) throw new UserInputError('Permission not allowed!')

            await db(update_branch, branch_id, branch_district, branch_name)

            return {
                status: 200,
                message: "Branch changed",
            }
        },
        addBranch: async (_, { input: { branch_district, branch_name } }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            const checkPermission = await db(check_permission, staff.staff_id, 2, 1)
            if (!checkPermission.length) throw new UserInputError('Permission not allowed!')

            await db(add_branch, branch_district, branch_name)

            return {
                status: 200,
                message: "Branch changed",
            }
        },
        deleteBranch: async (_, { branch_id }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            const checkPermission = await db(check_all_permission, staff.staff_id, branch, 2, 3)
            if (!checkPermission.length) throw new UserInputError('Permission not allowed!')

            await db(delete_branch, branch_id)

            return {
                status: 200,
                message: "Branch deleted",
            }
        },
    }
}