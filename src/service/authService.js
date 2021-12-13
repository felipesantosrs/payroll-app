
const { Op } = require("sequelize");


/**
     * Gets authentication based on the profile
     * @param {Headers - Profile} profile  - user profile
     * @returns {param} - filter to apply on query authenticated
 */
const authenticated = (profile) => {
    const profileId = profile.id

    return  {
        [Op.or]: [
            authenticatedClient(profileId), 
            authenticatedContractor(profileId), 
        ]
    }

}



/**
 * Gets authetication client query
 * @param {Headers - profile_id} profileId  - profile id from the header
 * @returns {param} - client id param 
 */
const authenticatedClient = (profileId) => {
    return  {ClientId: profileId}
        
}


/**
 * Gets authetication contractor query
 * @param {Headers - profile_id} profileId  - profile id from the header
 * @returns {param} - contractor id param 
 */
const authenticatedContractor = (profileId) => {
    return  {ClientId: profileId}
        
}


module.exports = {authenticated, authenticatedClient, authenticatedContractor}