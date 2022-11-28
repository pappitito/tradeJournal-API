const express = require('express')
const {getAllLogs, createNewLog, deleteLog, editLog, getLogsFilter } = require('../controllers/logsController')

const logrouter = express.Router()


logrouter.get('/',getAllLogs)

logrouter.get('/filter',getLogsFilter)

logrouter.post('/', createNewLog)


logrouter.patch('/:id', editLog)

logrouter.delete('/:id',deleteLog)



module.exports = {logrouter}