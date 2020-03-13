'use strict';
//Imports
const Request = require('request');
const PolizaConf = require('./poliza.config.js');


class Poliza {

    constructor() {
    }

    invokeURL(urlTarget,payload) {
        console.log( urlTarget);
        return new Promise((resolve, reject) => {
            Request(urlTarget, function (error, response, body) {
                let hitsRes = JSON.parse(body);
                let hitsArray = hitsRes.policy.workers;
                let UFsinhijos = {suma:0,contador:0, pagoEmpresa:0, copago:0 ,texto: "", cobdental:{suma:0,copagoDent:0, pagoEmpresaDent:0}};
                let UFconhijos = {suma:0,contador:0, pagoEmpresa:0, copago:0 ,texto: "", cobdental:{suma:0,copagoDent:0, pagoEmpresaDent:0}};
                let UF2omashijos = {suma:0,contador:0, pagoEmpresa:0, copago:0 ,texto: "", cobdental:{suma:0,copagoDent:0, pagoEmpresaDent:0}};
                let company_percentage = hitsRes.policy.company_percentage;
                let has_dental_care = hitsRes.policy.has_dental_care;
                
                let arrayPol = [];
                hitsArray.forEach(function (value) {
                    if (value.childs === 0  & value.age < 65) {
                        UFsinhijos.suma = (parseFloat(UFsinhijos.suma) + parseFloat(0.279))
                        UFsinhijos.cobdental.suma = (UFsinhijos.cobdental.suma + parseFloat(0.12))
                        UFsinhijos.contador = UFsinhijos.contador + 1;

                    }
                    else if (value.childs === 1 & value.age < 65) {
                        UFconhijos.suma = (parseFloat(UFconhijos.suma) + parseFloat(0.4396))
                        UFconhijos.cobdental.suma = (UFconhijos.cobdental.suma + parseFloat(0.1950))
                        UFconhijos.contador = UFconhijos.contador + 1;
                    }
                    else if (value.childs >= 2 & value.age < 65) {
                        UF2omashijos.suma = (parseFloat(UF2omashijos.suma) + parseFloat(0.5599));
                        UF2omashijos.cobdental.suma = (UF2omashijos.cobdental.suma + parseFloat(0.2480))
                        UF2omashijos.contador = UF2omashijos.contador + 1;
                    }
                });
               
                    UFsinhijos.pagoEmpresa = (parseFloat(0.279) * (company_percentage / 100));
                    UFconhijos.pagoEmpresa = (parseFloat(0.4396) * (company_percentage / 100));
                    UF2omashijos.pagoEmpresa = (parseFloat(0.5599) * (company_percentage / 100));                
                    UFsinhijos.copago = (parseFloat(0.279) - UFsinhijos.pagoEmpresa );
                    UFconhijos.copago = (parseFloat(0.4396) - UFconhijos.pagoEmpresa );
                UF2omashijos.copago = (parseFloat(0.5599) - UF2omashijos.pagoEmpresa);
                if (has_dental_care) {
                    UFsinhijos.cobdental.pagoEmpresaDent = (parseFloat(0.12) * (company_percentage / 100));
                    UFconhijos.cobdental.pagoEmpresaDent = (parseFloat(0.1950) * (company_percentage / 100));
                    UF2omashijos.cobdental.pagoEmpresaDent = (parseFloat(0.2480) * (company_percentage / 100));                
                    UFsinhijos.cobdental.copagoDent = (parseFloat(0.12) - UFsinhijos.cobdental.pagoEmpresaDent );
                    UFconhijos.cobdental.copagoDent = (parseFloat(0.1950) - UFconhijos.cobdental.pagoEmpresaDent );
                    UF2omashijos.cobdental.copagoDent = (parseFloat(0.2480) - UF2omashijos.cobdental.pagoEmpresaDent );
                }
              
                UFsinhijos.texto = "El total de la empresa a pagar por empleador sin hijos son: "+ UFsinhijos.suma.toFixed(4) +" que cubre la empresa con una cantidad de " +UFsinhijos.contador+ " trabajadores y cada uno debera realizar un copago de: " + UFsinhijos.copago +", la cobertura dental por parte de la empresa es de:" + UFsinhijos.cobdental.pagoEmpresaDent +" y el copago del trabajador sera de: " + UFsinhijos.cobdental.copagoDent ;
                UFconhijos.texto = "El total de la empresa a pagar por empleador con hijos son: "+ UFconhijos.suma.toFixed(4)+" que cubre la empresa con una cantidad de " +UFconhijos.contador+ " trabajadores y cada uno deberan realizar un copago de: " + UFconhijos.copago +", la cobertura dental por parte de la empresa es de:" + UFconhijos.cobdental.pagoEmpresaDent +" y el copago del trabajador sera de: " + UFconhijos.cobdental.copagoDent;
                UF2omashijos.texto = "El total de la empresa a pagar por empleador con 2 hijos o mas son: "+ UF2omashijos.suma.toFixed(4)+" que cubre la empresa con una cantidad de " +UF2omashijos.contador+ " trabajadores y cada uno deberan realizar un copago de: " + UF2omashijos.copago +", la cobertura dental por parte de la empresa es de:" + UF2omashijos.cobdental.pagoEmpresaDent +" y el copago del trabajador sera de: " + UF2omashijos.cobdental.copagoDent;
                arrayPol.push("el porcentaje de cobertura es:" +company_percentage+" y la condición de sí es que hay cobertura es:" + has_dental_care)
                arrayPol.push(UFsinhijos);
                arrayPol.push(UFconhijos);
                arrayPol.push(UF2omashijos);
                   console.log(arrayPol)
                // resolve(body);
            });

        });
    }

    generate(payload) {
        console.log(PolizaConf.API_POLIZA.endpoint);
        return this.invokeURL(PolizaConf.API_POLIZA.endpoint,payload)
    }

}

module.exports = {
    Poliza
}