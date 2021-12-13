
const {authenticated} = require('./authService')

const { Op } = require("sequelize");


const { Contract } = require('../model');

/**
     * @function getContractByIdLoggedUser - get contract by id and user logged in
     * @param {integer} id  - contract id 
     * @param {Profile} profile  - profile logged user
     * @returns {Contract} 
 */
const getContractByIdLoggedUser = async (id, profile) => {
    
    return await Contract.findOne({
        where: {
            [Op.and]: [
                {id},
                authenticated(profile)
            ]
        }
    
    })

}


/**
     * @function getAllContractsLoggedUserNotTerminated - get list of contracts not terminate for the user logged in
     * @param {Profile} profile  - profile logged user
     * @returns {List<Contract>} 
 */
const getAllContractsLoggedUserNotTerminated = async (profile) => {

   return  await Contract.findAll({
        where: {
            [Op.and]: [
                {
                    status:  {
                        [Op.ne]: 'terminated'
                    }
                },
                authenticated(profile)
            ]
        }
    })
}
module.exports = {
    getContractByIdLoggedUser, 
    getAllContractsLoggedUserNotTerminated
}
