let db = require('../app').db;
let topupCollection = db.collection('tiket_deposit');
let ObjectId = require('mongodb').ObjectID;
let HourLimit=1000 * 60 * 60 * 24;

exports.checkExpiredDateForTopup= ()=> {
    return new Promise((resolve, reject)=>{
        topupCollection.aggregate([
            {$match:{status:0}},{
                $redact:{
                    $cond:{
                        "if": {
                            "$gt": [
                                { "$subtract": [ new Date(), "$created_at" ] },
                                HourLimit
                            ]
                        },
                        "then": "$$KEEP",
                        "else": "$$PRUNE"
                    }
                }
            }
        ],function (err,result) {
            if(err)reject(err);
            else resolve(result)
        });
    });
};
exports.setTopupTicketExpired=(TiketID)=> {
    return new Promise((resolve, reject)=>{
        topupCollection.updateOne({_id:new ObjectId(TiketID)},
            {
                $set:
                    {
                        status:3,
                        expired_at:new Date()
                    }
            },function (err,result) {
                if (err)reject(err);
                else resolve(result)
            });
    });
};
