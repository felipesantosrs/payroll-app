
const { Profile } = require('../model');


/**
    * @function getProfileById - get profile by id
    * @param {interger} id  - profile id
    * @returns {Profile;e}
 */
const getProfileById = async (id) => {
    
    const profile =  await Profile.findByPk(id)
   
    if (!profile) return Error("there is no profile")

    return profile
    
}
/**
     * @function updateBalance - update balance from a profile
     * @param {number} id  - profile id
     * @param {number} amount  - amount to update balance
     * @param {transaction} t -  database transaction
 */
const updateBalance = async (id, amount, t) => {
    try {
        const profile =  await Profile.findByPk(id)

        if (amount == 0 ) throw 'Error amount is zero'
        
        profile.balance += amount
    
        return profile.save({transaction: t});
    } catch (error) {
        throw error
    }
 

}


module.exports = {
    getProfileById,
    updateBalance
}
