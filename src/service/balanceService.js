const {authenticated, authenticatedClient} = require('./authService')
const { Op } = require("sequelize");
const { Contract, Job, sequelize, Profile } = require('../model');
const profileService = require("./profileService");
const e = require('express');
const handleServide = require("../utils/handleUtils");


/**
     * @function depositAmountClientId - deposit amount on the client id
     * @param {integer} id  - client id
     * @param {number} amount  - number id
     * @returns {string} message confirmed the deposit or error 
 */
const depositAmountClientId = async (id, amount = 0) => {
    let transaction;
    try {
        transaction = await sequelize.transaction({isolationLevel: 'SERIALIZABLE'})

        let contract = await sumClientNeedsToPay(id)
        const totalPrice = contract[0]['Jobs.totalPrice'];

        let profileClient = await profileService.getProfileById(id)


        if (amount > totalPrice * 0.25 ) {
            throw 'Balance will be greater than 25%' 

        }
        await profileService.updateBalance(id, amount, transaction)
        
        await transaction.commit();

        return handleServide.message(`Deposited $${amount} into client id ${id}`)

    } catch (error) {
        transaction.rollback();
        return handleServide.message(error)
    }

}
  

/**
     * @function sumClientNeedsToPay - query all jobs to pay
     * @param {integer} id  - client id
     * @returns {JSON} Contact  - {ClientId,totalPrice }
 */
const sumClientNeedsToPay = async (clientId) =>{
    try {
        return Contract.findAll({
            attributes: ['ClientId'],
            where: { id: clientId  },
            include: [
                {
                    model: Job,
                    required: true,
                    where:    {paid:  {[Op.not]: true}},
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('price')), 'totalPrice']
                    ],
    
                }
            ],
            group: ['ClientId'],
            raw: true,
            order: [
                [sequelize.literal('`Jobs.totalPrice`  DESC')]
           ],
           subQuery:false,
           limit: 1
              
        })
    } catch (error) {
        throw error
    }

  
}




module.exports = {
    depositAmountClientId
}
