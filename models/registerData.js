const {Sequelize, DataTypes, Model} = require('sequelize');
const { db } = require('../db/connection');

    const DataRegister = db.define(
        'registers',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sensorf_uno: {
                type: DataTypes.DOUBLE
            },
            sensorf_dos:{
                type: DataTypes.DOUBLE
            },
            sensorf_tres:{
                type: DataTypes.DOUBLE
            },           
            presion:{
                type: DataTypes.DOUBLE
            },
            fecha:{
                type: DataTypes.DATE
            },
            createdAt:{
                type: DataTypes.DATE
            },
            updatedAt:{
                type: DataTypes.DATE
            },
            sesorf_cuatro:{
                type: DataTypes.DOUBLE
            },
        }, {tablename: 'registers'}
    )
    // return DataSchema;
// }
module.exports = {DataRegister};