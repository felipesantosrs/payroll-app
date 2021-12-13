
const {authenticated, authenticatedClient} = require('./authService')
const { Op } = require("sequelize");
const { Contract, Job, sequelize, Profile } = require('../model');
const profileService = require("./profileService");
const handleServide = require("../utils/handleUtils");

/**
     * @function payJob = pay a job using client balance
     * @param {number} id - job id
 * 
 */
const payJob = async (id) => {
    let transaction;
    try {
        transaction = await sequelize.transaction({isolationLevel: 'SERIALIZABLE'})
        let job = await getJobUnpaid(id)

        if (!job)  throw  `Job id ${id} not found or already paid`
       
        let profileClient = await profileService.getProfileById(job.Contract.ClientId)

        if (profileClient.balance <= job.price) {
            throw  'There is no balance available'
        }

        await profileService.updateBalance(job.Contract.ClientId, -job.price , transaction)
        await profileService.updateBalance(job.Contract.ContractorId, job.price , transaction)

        await changeJobtoPaid(job, transaction)
        transaction.commit();
        return handleServide.message(`Job id ${id} paid`)
    } catch (error) {
        transaction.rollback();
        console.log(error)
        return handleServide.message(error)
    }

}
  
/**
 * @function changeJobtoPaid - change job status to paid
 * @param {Job} job 
 */
const changeJobtoPaid =  async (job, t) => {
    job.paid = true
    return job.save({transaction: t});

}

/**
     * @function getJobUnpaid - get upaid job by id
     * @param {integer} id  - job id
     * @returns {Job} - unpaid job by
 */
const getJobUnpaid = async (id) =>{
    return await Job.findOne({
        //TODO NOT SURE THAT SHOULD FILTER BY UNPAID. It is not saying on the requeriment but the endpoin says unpaid
        where: {
           id, 
           paid:  {[Op.not]: true}
        },
        include: [{
            model: Contract,
            required: true
        }]

    })

}




/**
     * @function getUnpaidJobsInProgress - gets jobs unpaid and in progress for logged user as contractor or client
     * @param {Profile} profile  - profile logged user
     * @returns {List<Job>} 
 */
const getUnpaidJobsInProgress = async (profile) => {
    return await Job.findAll({
        //TODO NOT SURE THAT SHOULD FILTER BY UNPAID. It is not saying on the requeriment but the endpoin says unpaid
        where:    {paid:  {[Op.not]: true}},
        include: [{
            model: Contract,
            required: true,
            where: {
                [Op.and]: [
                    {status: 'in_progress'},
                    authenticated(profile)
                ]
            },
        }]

    })
}

module.exports = {
    getUnpaidJobsInProgress,
    payJob
}
