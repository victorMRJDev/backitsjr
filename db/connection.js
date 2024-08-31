const { Sequelize } = require('sequelize');
const db = new Sequelize('aquasmarthome_sjr','372013','itsj123',{
    host: 'mysql-aquasmarthome.alwaysdata.net',
    dialect: 'mysql',
}) 
module.exports = {
    db
}