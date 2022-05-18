const get_district_by_id = `
    SELECT * FROM districts WHERE district_id = $1
`

export {
    get_district_by_id
}