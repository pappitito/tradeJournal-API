const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    pair: {
        type: String,
        required: true
    },
    openDate: {
        type: Date,
        
    },
    strategy: String,
    direction: {
        type: String,
        values: ['short', 'long']

    },
    entryPrice: {
        type:  mongoose.Types.Decimal128,
        required: true,
        default: 0.0000
    },
    stopLoss: {
        type:  mongoose.Types.Decimal128,
        required: true,
        default: 0.0000
    },
    takeProfit: {
        type:  mongoose.Types.Decimal128,
        required: true,
        default: 0.0000
    },
    positionSize:{
        type:  mongoose.Types.Decimal128,
        required: true,
        default: 0.0000
    },
    exitPrice:{
        type:  mongoose.Types.Decimal128,
        required: true,
        default: 0.0000
    },
    result:{
        type: String,
        values: ['won','lost','breakeven']
    
    },
    risktoreward:{
        type: mongoose.Types.Decimal128,
        default: 0.0000
    },
    closeDate: {
        type: Date,
        
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'please provide a user']
    }

  
}, {timestamps: true})

module.exports = mongoose.model('logs', logSchema)