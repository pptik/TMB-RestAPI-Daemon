let db = require('../app').db
let tmbTracker = db.collection('public_transport_tracker')
let tmbTrackerHistory = db.collection('public_transport_tracker_history')
let ObjectId = require('mongodb').ObjectID
let moment = require('moment')
let id = require('moment/locale/id')
let dateFormat = "YYYY-MM-DD HH:mm:ss"

exports.insertToTMBTrackerHistory = (query) => {
    return new Promise((resolve, reject) => {
        let gpstrackerdate = moment(query.gpsdatetime, dateFormat, 'id')
        let tmbQuery = {
            plat_id: query.buscode.replace(" ", ""),
            type: 'Trans Metro Bandung',
            trayek_id: 'N/A',
            name: query.koridor,
            city_id: "022",
            driver_name: 'N/A',
            trip_status: 0,
            time: gpstrackerdate.toDate(),
            device_phone_number: 'N/A',
            driver_phone_number: 'N/A',
            device_id: "tmb_unit_" + query.buscode.replace(" ", ""),
            location: {
                type: "Point",
                coordinates: [parseFloat(query.longitude), parseFloat(query.latitude)]
            },
            location_raw: {
                type: "Point",
                coordinates: [parseFloat(query.longitude), parseFloat(query.latitude)]
            },
            picture: 'default.png'
        }

        tmbTrackerHistory.insertOne(tmbQuery, function (err, result) {
            if (err) reject(false)
            else resolve(true)
        })
    })
}
exports.updateToTMBTracker = (query) => {
    return new Promise((resolve, reject) => {
        let gpstrackerdate = moment(query.gpsdatetime, dateFormat, 'id')
        let tmbQuery = {
            plat_id: query.buscode.replace(/ /g, ""),
            type: 'Trans Metro Bandung',
            trayek_id: 'N/A',
            name: minimizeName(query.koridor),
            city_id: "022",
            driver_name: 'N/A',
            trip_status: 0,
            time: gpstrackerdate.toDate(),
            device_phone_number: 'N/A',
            driver_phone_number: 'N/A',
            device_id: "tmb_unit_" + query.buscode.replace(/ /g, ""),
            location: {
                type: "Point",
                coordinates: [parseFloat(query.longitude), parseFloat(query.latitude)]
            },
            location_raw: {
                type: "Point",
                coordinates: [parseFloat(query.longitude), parseFloat(query.latitude)]
            },
            picture: 'default.png'
        }
        tmbTracker.updateOne({ buscode: query.buscode }, { $set: tmbQuery }, { upsert: true }, function (err, result) {
            if (err) reject(false)
            else resolve(true)
        })
    })
}


minimizeName = (name) => {
    name = name.replace(/,/g, " ");
    name = Array.from(new Set(name.split(' '))).toString();
    name = name.replace(/,/g, " ")
    return name
}