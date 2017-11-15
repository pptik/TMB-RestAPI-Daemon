let tmbModel=require('../model/tmb_model');
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
                let busLocs=json.buswaytracking;
                console.log(busLocs.length);
                for (let busloc of busLocs) {
                    tmbModel.insertToTMBTrackerHistory(busloc);
                    console.log(moment("2017-11-15T18:09:08.000+0000").format('LL'));
                }
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