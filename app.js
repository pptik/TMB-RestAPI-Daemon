const Agenda = require('agenda')
const mongoUri = require('./setup/database').MONGODB_URL
const MongoClient = require('mongodb').MongoClient
    , assert = require('assert')
async function run() {
    const db = await MongoClient.connect(mongoUri)
    console.log("Connect to Db Success")
    exports.db = db
    await db.collection('agendaTaskSchedulerJobs', function (err, collection) {
        collection.update({ lockedAt: { $exists: true }, lastFinishedAt: { $exists: true } }, { $unset: { lockedAt: undefined, lastModifiedBy: undefined, lastRunAt: undefined }, $set: { nextRunAt: new Date() } }, { multi: true }, function (e, numUnlocked) {
            if (e) console.error(e)
        })
    })

    const schedulerJobs = require('./scheduler/schedulerjob')
    const agenda = new Agenda().mongo(db, 'agendaTaskSchedulerJobs')
    agenda.define('getdata tmb', () => {
        console.log('Get Data Posisi TMB')
        schedulerJobs.getDataTMB()
    })

    agenda.on('ready', () => {
        agenda.every('30 seconds', 'getdata tmb')
        agenda.start()
    })
}

run().catch(error => {
    console.error(error)
    console.log("Try connectin in 5 second")
    setTimeout(function () {
        run()
    }, 5000)
})