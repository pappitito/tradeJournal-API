
const logs = require('../model/logModel')
const {asyncWrapper} = require('../middlewares/async')
const {StatusCodes} = require('http-status-codes')


const getAllLogs = asyncWrapper(async (req,res) =>{

        const allLogs = await logs.find({createdBy: req.user.userId}).sort('createdAt')
        res.status(StatusCodes.OK).json({ allLogs})


})

const createNewLog = asyncWrapper(async (req,res) => {
        req.body.createdBy = req.user.userId
       let {pair, entryPrice, exitPrice, direction, stopLoss, takeProfit} = req.body
       if(!pair){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'please provide pair'})
       }
       req.body.direction = direction.toLowerCase()
       direction = direction.toLowerCase()
       switch (direction) {
        case 'short':
            if(exitPrice < entryPrice){
                req.body.result = 'won'
            }
            else if(exitPrice === entryPrice){
                req.body.result = 'breakeven'
            }
            else{
                req.body.result = 'lost'
            }
            if(stopLoss <= entryPrice){
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'invalid stop loss'})
            }
            if(takeProfit >= entryPrice){
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'invalid take profit'})
            }
            req.body.risktoreward = (entryPrice - takeProfit)/(stopLoss - entryPrice)
            break;
        case 'long':
            if(exitPrice > entryPrice){
                req.body.result = 'won'
            }
            else if(exitPrice === entryPrice){
                req.body.result = 'breakeven'
            }
            else{
                req.body.result = 'lost'
            }
            if(stopLoss >= entryPrice){
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'invalid stop loss'})
            }
            if(takeProfit <= entryPrice){
                return res.status(StatusCodes.BAD_REQUEST).json({msg: 'invalid take profit'})
            }
            req.body.risktoreward = (takeProfit - entryPrice)/(entryPrice - stopLoss)

            break;
       
        default:
            break;
       }
  
        const newLog = await logs.create(req.body)
        const allLogs = await logs.find({createdBy: req.user.userId}).sort('createdAt')
        res.status(StatusCodes.OK).json({allLogs})

})



const editLog = asyncWrapper(async (req,res) =>{
    
        const {id} = req.params 
        const log = await logs.findOneAndUpdate({_id: id, createdBy: req.user.userId}, req.body, { new: true, runValidators: true})
        const allLogs = await logs.find({createdBy: req.user.userId}).sort('createdAt')
        
        res.status(StatusCodes.OK).json({allLogs})
        if(!log){
            return res.status(StatusCodes.NOT_FOUND).json({ message: `no log with id: ${id}`})
        }


})

const deleteLog = asyncWrapper(async(req,res) =>{
    const {id} = req.params
        const log = await logs.findOneAndDelete({_id: id, createdBy: req.user.userId})
        const allLogs = await logs.find({createdBy: req.user.userId}).sort('createdAt')
        res.status(StatusCodes.OK).json({allLogs})
        if(!log){
            return res.status(StatusCodes.NOT_FOUND).json({ message: `no log with id: ${id}`})
        }


})

const getLogsFilter = asyncWrapper(async(req,res)=>{
    const {pair, result, numericFilters} = req.query
    let queryObject = {}
    queryObject.createdBy = req.user.userId
    if(pair){
        queryObject.pair = pair

    }
    if(result){
        queryObject.result = result
    }
    if(numericFilters){
        const operatorMap = {
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' : '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match)=> `-${operatorMap[match]}-`)
        const options = ['risktoreward']
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator] : Number(value)}
            }
        })
    }

    const log = await logs.find(queryObject) 
    res.status(StatusCodes.OK).json({log})

})


module.exports = {getAllLogs, createNewLog, deleteLog, editLog, getLogsFilter}