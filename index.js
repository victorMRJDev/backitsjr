const express = require('express');
require('dotenv').config();
const { db } = require('./db/connection');
const cors = require('cors');

//Crear el servidor de express
const app = express();

//Base de datos
async function dbConnection(){
    try{

        await db.authenticate();
        console.log('Base de datos online');

    }catch(error){
        console.log('Error', error);
    }
}

app.use(cors());

//Directorio publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas

app.use('/api/register', require('./routes/register'));
app.use('/api/getParams', require('./routes/register'));



//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

