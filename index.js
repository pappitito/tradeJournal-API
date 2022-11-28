//some comment on this api

const express = require('express')
const app = express()
const errorHandler = require('./middlewares/errorHandler')
const authenticateUser = require('./middlewares/authmiddleware')
const {connectDB} = require('./connect')
const cors = require('cors')
require('dotenv').config()

const {authrouter} = require('./routes/authRoute')
const {logrouter} = require('./routes/logsRoute')


const port = process.env.PORT || 5000

async function start(){
    try{
        await connectDB(process.env.mongo_uri)
        console.log('connected to the DB');
        app.listen(port,()=> console.log(`server is listening via port ${port} `))
    }catch(error){
        console.log(error)
    }

}
start()


app.use(express.json())
app.get('/', (req,res)=>{
    res.status(200).send('Welcome to trade journal API')
})
app.use(cors())
app.use('/wbt/api/users', authrouter )
app.use('/wbt/api/tradelogs', authenticateUser, logrouter)

app.use(errorHandler)
