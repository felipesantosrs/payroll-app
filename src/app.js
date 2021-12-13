const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, Profile} = require('./model')
const { Op } = require("sequelize");
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
const contractService = require('./service/contractService')
const jobService = require('./service/jobService')
const handleServide = require("./utils/handleUtils");
const adminService = require('./service/adminService')

const balanceService = require('./service/balanceService')

/**
    * @GET /contracts/:id'
    * Gets contract by id
    * @returns {Contact} - contact by id 
 */
app.get('/contracts/:id', getProfile, async (req, res) =>{
    const {id} = req.params
    const {profile} = req
    handleServide.response(res, await contractService.getContractByIdLoggedUser(id, profile))
})

/**
    * @GET /contracts'
    * Gets contract list not terminated
    * @returns {List<Contact>} - list of contracts logged user
 */
app.get('/contracts', getProfile, async (req, res) =>{
    const {profile} = req
    handleServide.response(res, await contractService.getAllContractsLoggedUserNotTerminated(profile))
})

/**
    * @GET /jobs/unpaid'
    * Gets Jobs unpaid for logged user as contractor or client
    * @returns {List<Contact>} - list of jobs unpaid
 */
app.get('/jobs/unpaid', getProfile, async (req, res) =>{
    const {profile} = req
    handleServide.response(res, await jobService.getUnpaidJobsInProgress(profile))
})

/**
    * @GET /admin/best-profession'
    * Gets the professional that earned the most money for any contractor
    * @returns {Profile} -  Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range
 */

app.get('/admin/best-profession', async (req, res) =>{
    const {start, end} = req.query
    handleServide.response(res, await adminService.getProfessionalEarnedHigestAmount(start, end))
    
})

/**
    * @GET /admin/best-clients'
    * Gets the client list that most amount spent
    * @returns List<Profile> -  returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 */
app.get('/admin/best-clients', async (req, res) =>{
    const {start, end, limit} = req.query
    handleServide.response(res, await adminService.getClientListSpentHigestAmount(start, end, limit))
    
})

/**
    * @POST /jobs/:id/pay
    * Pay a job using client balance
 */
app.post('/jobs/:id/pay', getProfile, async (req, res) =>{
    const {profile} = req
    const {id} = req.params
    handleServide.response(res, await jobService.payJob(id))
})



/**
     * @POST /balances/deposit/:userId
     * Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 */
app.post('/balances/deposit/:userId', getProfile, async (req, res) =>{
    const {userId} = req.params
    handleServide.response(res, await balanceService.depositAmountClientId(userId, req.body.amount))
})



module.exports = app;
