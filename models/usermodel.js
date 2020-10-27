const db = require('./connection')

function userModel() {
    this.fetchsubcat = (catnm) => {
        return new Promise((resolve, reject) => {
            db.collection("subcategory").find({ 'catnm': catnm }).toArray((err, data) => {
                if (err)
                    reject(err)
                else
                    resolve(data)
            })
        })
    }


    this.fetchlocality = (c) => {
        return new Promise((resolve, reject) => {
            db.collection("locality").find({ 'cityname': c }).toArray((err, data) => {
                if (err)
                    reject(err)
                else
                    resolve(data)
            })
        })
    }
    this.Addlocation = (locationDetails) => {
        return new Promise((resolve, reject) => {
            db.collection("location").find().toArray((err, data) => {
                if (err)
                    reject(err)
                else {
                    if (data.length == 0)
                        locationDetails._id = 1
                    else {
                        max_id = data[0]._id
                        for (row of data) {
                            if (max_id < row._id)
                                max_id = row._id
                        }
                        locationDetails._id = max_id + 1
                    }
                    db.collection("location").insert(locationDetails, (err) => {
                        if (err)
                            reject(err)
                        else
                            resolve(true)
                    })
                }
            })

        })
    }
    this.managelocation = () => {
        return new Promise((resolve, reject) => {
            db.collection("location").find({}).toArray((err, data) => {
                if (err)
                    reject(err)
                else
                    resolve(data)
            })
        })

    }
    this.payment = (urlData) => {
        return new Promise((resolve, reject) => {
            db.collection("payment").find().toArray((err, data) => {
                if (err)
                    reject(err)
                else {
                    if (data.length == 0)
                        urlData._id = 1
                    else {
                        max_id = data[0]._id
                        for (row of data) {
                            if (max_id < row._id)
                                max_id = row._id
                        }
                        urlData._id = max_id + 1
                        urlData.info = Date()
                    }
                    db.collection("payment").insert(urlData, (err) => {
                        if (err)
                            reject(err)
                        else {
                            db.collection('location').update({ '_id': parseInt(urlData.locationid) }, { $set: { 'status': 1 } }, (err) => {
                                if (err)
                                    reject(err)
                                else
                                    resolve(true)
                            })
                        }
                    })
                }
            })

        })
    }
    this.changepassword = (email, cpassDetails) => {
        return new Promise((resolve, reject) => {

        })
    }
}
module.exports = new userModel()