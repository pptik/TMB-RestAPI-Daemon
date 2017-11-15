let db = require('../app').db;
let withdrawalTiketCollection = db.collection('penarikan');
let ObjectId = require('mongodb').ObjectID;
let HourLimit=1000 * 60 * 60 * 24;
exports.checkExpiredDateForWithdrawal= ()=> {
    return new Promise((resolve, reject)=>{
        withdrawalTiketCollection.aggregate([
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
            else resolve(result);
        });
    });
};
exports.setWithdrawalTicketExpired=(TiketID)=> {
    return new Promise((resolve, reject)=>{
        withdrawalTiketCollection.updateOne({_id:new ObjectId(TiketID)},
            {
                $set:
                    {
                        status:2,
                        expired_at:new Date()
                    }
            },function (err,result) {
                if (err)reject(err);
                else resolve(result)
            });
    });
};
