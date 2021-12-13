const {authenticated} = require('./authService')

const { Op } = require("sequelize");
const { sequelize, Contract, Job, Profile } = require('../model');


/**
    * @function getProfessionalEarnedHigestAmount - get the profile from contractor that got higest amout
    * @param {date} start 
    * @param {date} end 
    * @returns {Profile} profile who got the higest amount
 */
const getProfessionalEarnedHigestAmount = async (start = Date.now() , end = Date.now() ) => {
    const contract = await getHigestSumPriceContract(start, end)
    if (contract) {
        return Profile.findOne({
            where:  {id: contract[0].ContractorId}, 
        
        })
    }
   
}


/**
    * @function Gets the client list that most amount spent - get list of clients who spent higest amount
    * @param {date} start 
    * @param {date} end 
    * @param {integer} limit
    * @returns {List<Profile>} list of clients
 */
const getClientListSpentHigestAmount = async (start = Date.now() , end = Date.now() , limit = 1) => {

    const contracts = await getHigestSumPriceContract(start, end, 'ClientId', limit)

    let profiles = []
    for ( contract of contracts){
        profiles.push(await Profile.findOne({where:  {id: contract.ClientId}}))
    }
    return  profiles
}
/**
     * @function getHigestSumPriceContract - gets the higest contractorId or clientid with the total prince on the job
     * @param {date} start 
     * @param {date} end 
     * @param {string} (ContractorId, ClientId) 
     * @param {integer} limit 
     * @returns {JSON} {ContractorId, ClientId, totalPrice }
 */
const getHigestSumPriceContract = async (start, end, contractType = 'ContractorId', limit  = 1) => {
    return Contract.findAll({
        attributes: ['ContractorId', 'ClientId'],
        include: [
            {
                model: Job,
                required: true,
                where: {
                    paymentDate: {
                        [Op.between]: [start, end]
                    }
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('price')), 'totalPrice']],

            }
        ],
        group: [contractType],
        raw: true,
        order: [
            [sequelize.literal('`Jobs.totalPrice`  DESC')]
       ],
       subQuery:false,
       limit: limit
          
    })
}


module.exports = {
    getProfessionalEarnedHigestAmount, 
    getClientListSpentHigestAmount
}
