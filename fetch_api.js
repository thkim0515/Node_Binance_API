const fs = require('fs');

async function binance_get_params(endPoint_, dataQueryString_, method_) {
    const data = fs.readFileSync('./myapi.txt', 'utf8');
    const array = data.toString().split("\n");

    return array;
}   
