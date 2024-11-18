const {response} = require('express');
const { DataRegister } = require('../models/registerData');
const moment = require('moment');
moment.locale('es');

const registerParams = async (req, res = response) => {
    
    var datetime = new Date();
    console.log(req.body);

    // const { presion, flujo } = req.body;
    // const fuga = (presion >= 2.5 && presion <= 3) && (flujo >= 25 && flujo <= 30) ? 1 : 0;


    dataRegist = new DataRegister({
        ...req.body,
        // fuga: fuga,
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

const getRegsterParamas = async (req, res = response) => {

  try{
    const params = await DataRegister.findAll();


    const groupData = {
        "julio":[],
        "agosto":[],
        "septiembre":[],
        "octubre":[],
        "noviembre":[],
        // "diciembre":[]
    }


    params.forEach(item => {
        const fecha = moment(item.fecha,'YYYY-MM-DD');
        const monthName = fecha.format('MMMM');

        const startDate = moment('2024-09-19','YYYY-MM-DD');

        if(groupData[monthName]){
            groupData[monthName].push({
                // id: item.id,
                sensorf_uno: item.sensorf_uno  ?? 0,
                sensorf_dos: item.sensorf_dos  ?? 0,
                sensorf_tres: item.sensorf_tres  ?? 0,
                sesorf_cuatro: item.sesorf_cuatro  ?? 0,
                presion: item.presion  ?? 0,
                fecha: item.fecha,
                // fuga: item.fuga
            });
        }
    });

    const averages = {}
    // const monthFugas = {};

    for(const month in groupData){
        const monthData = groupData[month];

        //Conteo de fugas
        const totalFugas = monthData.filter(item=>
            item.sensorf_uno >20 && item.sesorf_cuatro > 20
        ).length;
        console.log(totalFugas)

        if(monthData.length > 0){

            const filteredData = monthData.filter(item =>
                item.sensorf_uno > 0 || 
                item.sensorf_dos > 0 || 
                item.sensorf_tres > 0 || 
                item.sesorf_cuatro > 0 || 
                item.presion > 0
              );


            if(filteredData.length > 0){
                // console.log(params); // Verificar los datos recibidos

                const total = monthData.reduce((acc, item)=>{
                    return{
                        sensorf_uno: acc.sensorf_uno + (item.sensorf_uno || 0),
                        sensorf_dos: acc.sensorf_dos + (item.sensorf_dos || 0),
                        sensorf_tres: acc.sensorf_tres + (item.sensorf_tres || 0),
                        sesorf_cuatro: acc.sesorf_cuatro + (item.sesorf_cuatro || 0),
                        presion: acc.presion + (item.presion || 0),
                        // fuga: acc.fuga + item.fuga
                    };
                },{
                    sensorf_uno: 0,
                    sensorf_dos: 0,
                    sensorf_tres: 0,
                    sesorf_cuatro: 0,
                    presion: 0,
                    // fuga: 0
                });
    
                averages[month] = {
                    sensorf_uno: (total.sensorf_uno / monthData.length) / 1000,
                    sensorf_dos: (total.sensorf_dos / monthData.length / 1000),
                    sensorf_tres: (total.sensorf_tres / monthData.length / 1000),
                    sesorf_cuatro: (total.sesorf_cuatro / monthData.length / 1000),
                    presion: total.presion / monthData.length,
                    monthFugas: totalFugas,
                    // fuga: total.fuga / monthData.length
                };

                
            }else{
                averages[month] = { sensorf_uno: 0, sensorf_dos: 0, sensorf_tres: 0, sesorf_cuatro: 0, presion: 0, monthFugas: 0 };
            }
        }else{
            averages[month] = {
                sensorf_uno: 0,
                sensorf_dos: 0,
                sensorf_tres: 0,
                sesorf_cuatro: 0,
                presion: 0,
                monthFugas: 0,
                // fuga: 0
            };
        }
    }

    const latestData = await DataRegister.findOne({
        order:[
            ['id','DESC']
        ],
        attributes: ['presion', 'sensorf_uno', 'sensorf_dos', 'sensorf_tres', 'sesorf_cuatro']
    });

    let status = "normal";
    if(latestData){
        const { sensorf_uno, sesorf_cuatro } = latestData;
        if(sensorf_uno > 20 && sesorf_cuatro > 20){
            status = "anormal";
        }
    }
    if (latestData) {
        console.log('Último registro recuperado:', latestData.toJSON());
    } else {
        console.log('No se encontró un registro reciente.');
    }

    res.json({
        ok: true,
        averages,
        latestData,
        status,
        msg: 'averages sensors'
    })


  }catch (error){
    console.log('Error fetching parameters', error);

    res.status(500).json({
      ok: false,
      msg: 'Error al obterner los parametros'
    });
  }

}

module.exports = {
    registerParams,
    getRegsterParamas
};