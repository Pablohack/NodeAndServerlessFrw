'use strict';
const Boom = require('boom');
const PolizaService = require('./src/poliza').Poliza;
let polizaService = new PolizaService();

module.exports.polizaFunc = async event => {
  console.log('info', '[HANDLER] [MESSAGE] createMessage ...');

  polizaService.generate(event.body)
  .then((message)=> {
      
    const response = {
        statusCode: 200,
        body: JSON.stringify(message),
    };
    console.log(response)
    //  callback(null, response);
  })
  .catch((err) => {
      console.log('info', 'ERROR' );
      throw Boom.badRequest(err);
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
