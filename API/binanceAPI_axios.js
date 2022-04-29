const fs     = require('fs');
const axios  = require('axios');
const crypto = require('crypto');
const env    = require('dotenv').config({path : './api.env' });

async function binance_API(endPoint, dataQueryString, method) {
    const base_url = 'https://fapi.binance.com'
    const keys = {
        "api": process.env.API,
        "sec": process.env.SEC,
    }

    const _api = JSON.stringify(keys['api']).replace(/\\r|"|'/g, '');
    const _sec = JSON.stringify(keys['sec']).replace(/\"|'/g, '');

    let signature = crypto.createHmac('sha256', _sec).update(dataQueryString).digest('hex');
    let url = base_url + endPoint + '?' + dataQueryString + '&signature=' + signature;
    var JSON_object = '';

    const response = await axios(url, {
        'method': method,
        'headers': {
            'X-MBX-APIKEY': _api
        },
        timeout: 5000,
    }).then((res) => {
        JSON_object = res.data;
    }).catch(function (error) {
        console.log('-----------------------------------------------'); 
        console.log(error.response.data); // main_error_data
        console.log('-----------------------------------------------'); 
        console.log(JSON.stringify(error, null, 4));
    });
    return JSON_object;
}

module.exports = {
    binance_API: binance_API,
};