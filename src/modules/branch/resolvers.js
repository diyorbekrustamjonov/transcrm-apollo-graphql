import { UserInputError } from 'apollo-server-core'
import format from 'pg-format'

import { add_branch, get_branches_more, update_branch, delete_branch } from './query.js'

import check_token from '#utils/checkToken'; 
import db from '#utils/dbConnection';

import { check_permission, check_all_permission } from '#modules/permission/query';
import { get_district_by_id } from '#modules/district/query';


export default {
    Query: {
        branches: async (_, { search, sort }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            const checkPermission = await db(check_permission, staff.staff_id, 2, 2)
            if (!checkPermission.length) throw new UserInputError('you are not allowed to see the branches!')
            const allowedBranches = checkPermission.map(permission => permission.branch)
            const sort_key = Object.keys(sort || {})[0]
            let rows = await db(format(get_branches_more, allowedBranches.length ? allowedBranches : null), search , sort_key, sort?.[sort_key])
            
            return rows.map(row => {
                row.address = {
                    city: row.city_name,
                    district: row.district_name
                }
                return row
            })
        }
    },
    Mutation: {
        changeBranch: async (_, { branch_id, input: { branch_district, branch_name } }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            const checkPermission = await db(check_all_permission, staff.staff_id, branch_id, 2, 4)
            if (!checkPermission.length) throw new UserInputError('Branch change is not allowed!')
            const check_district = await db(get_district_by_id, branch_district)
            if (!check_district.length) throw new UserInputError('District not found!')
            await db(update_branch, branch_id, branch_district, branch_name);
            return {
                status: 200,
                message: "Branch changed",
            }
        },
        addBranch: async (_, { input: { branch_district, branch_name } }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            const checkPermission = await db(check_permission, staff.staff_id, 2, 1)
            if (!checkPermission.length) throw new UserInputError('Branch creation is not allowed!')
            const check_district = await db(get_district_by_id, branch_district)
            if (!check_district.length) throw new UserInputError('District not found!')
            await db(add_branch, branch_district, branch_name)
            return {
                status: 200,
                message: "Branch created",
            }
        },
        deleteBranch: async (_, { branch_id }, { token, user_agent }) => {
            if (!token) throw new UserInputError('Token is required!')
            const [ staff ] = await check_token(token, user_agent)
            const checkPermission = await db(check_all_permission, staff.staff_id, branch_id, 2, 3)
            if (!checkPermission.length) throw new UserInputError('Permission not allowed!')
            await db(delete_branch, branch_id)
            return {
                status: 200,
                message: "Branch deleted",
            }
        },
    }
}