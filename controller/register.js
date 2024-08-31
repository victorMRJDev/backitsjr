const {response} = require('express');
const { DataRegister } = require('../models/registerData');

const registerParams = async (req, res = response) => {
    
    var datetime = new Date();
    console.log(req.body);

    dataRegist = new DataRegister({
        ...req.body,
        fecha: datetime.toISOString().slice(0,10),
        createAt: datetime.toISOString().slice(0,10),
    })

    await dataRegist.save();

    res.status(201).json({
        ok:true,
        msg: 'registerParams',
        params: req.body
    });
}

module.exports = {
    registerParams
};