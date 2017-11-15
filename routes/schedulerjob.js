let withdrawalModel=require('../model/withdrawal_model');
let topupModel=require('../model/topup_model');
const request = require('request');
const TMBRestAPIUri=require('../setup/tsconfig.json').TMBRestAPIUri;

async function getDataTMB() {
    try {
        const options = {
            url: TMBRestAPIUri,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'my-reddit-client'
            }
        };
        request(options, function(err, res, body) {
            if(err){
                console.log(err)
            }else {
                let json = JSON.parse(body);
                console.log(json);
            }
        });
    }catch (err){
        console.log(err);
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    }
}
module.exports={
    getDataTMB:getDataTMB
};