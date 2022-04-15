const axios_export = require('./binanceAPI_axios');
const axios        = require('axios');
const method       = ['GET', 'POST', 'DELETE'];

// 테스트 함수
async function test(symbol, marginType){
    var endpoint = '';
    var query = `&timestamp=${Date.now()}`;

    const res = await axios_export.binance_API(endpoint, query, method[1]);
    console.log(res);
}

//test()

// 잔고 확인
async function my_balance() {
    var endpoint = '/fapi/v2/balance';
    var query = `&timestamp=${Date.now()}`;

    await axios_export.binance_API(endpoint, query, method[0]);
}

// 보유 심볼 확인
async function my_account() {
    var endpoint = '/fapi/v2/account';
    var query = `&timestamp=${Date.now()}`;

    await axios_export.binance_API(endpoint, query, method[0]);
}

// 주문넣기
async function post_order(symbol, side, type, quantity, price) {
    var quantity = Math.abs(quantity);
    var endpoint = '/fapi/v1/order';
    var query = `symbol=${symbol.toUpperCase()}&side=${side.toUpperCase()}&type=${type.toUpperCase()}&timeInForce=GTC&quantity=${quantity}&price=${price}&recvWindow=10000&timestamp=${Date.now()}`;

    await axios_export.binance_API(endpoint, query, method[1]);
}

// 주문 취소
async function cancel_order(symbol) {
    var endpoint = '/fapi/v1/allOpenOrders';
    var query = `symbol=${symbol.toUpperCase()}&timestamp=${Date.now()}`;

    await axios_export.binance_API(endpoint, query, method[2]);
}

// 심볼 Fetch
async function get_symbol() {
    var endpoint = '/fapi/v1/ticker/price';
    var query = '';

    const getInfo = async () => {
        const res = await axios_export.binance_API(endpoint, query, method[0]);
        const symbol_list = [];
        for ( i = 0; i < res.length; i++){
            symbol_list.push(res[i].symbol);
        }
        return symbol_list;
    }
    getInfo()
        .then(console.log)
        .catch(console.error());
    
}

// 포지션 종료 [Fetch Params]
// code // 10,25,50,100 Percent Closing
async function get_close_params(symbol,code) {
    var symbolUp = symbol.toUpperCase();
    var endpoint = '/fapi/v2/account';
    var query = `&timestamp=${Date.now()}`;

    const getInfo = async () => {
        const res = await axios_export.binance_API(endpoint, query, method[0])
        var my_position = await res.positions;
        var target_symobl = await my_position.filter(symbol => symbol.symbol == symbolUp);
        return [target_symobl, symbol, code];
    }
 
    getInfo()
        .then(closing_position)
        .catch(console.error());
}

// 포지션 종료 [Closing Order]
async function closing_position(target_symobl) {
    if (target_symobl) {
        let positionAMT = target_symobl[0][0].positionAmt;
        let symobl = target_symobl[1].toUpperCase();
        let rurl = 'https://api.binance.com/api/v1/ticker/price?symbol=';
        let hap = rurl + symobl;

        await axios(hap, {
                method: 'GET',
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                if (positionAMT != 0.0) {
                    let side = (positionAMT >= 0) ? 'sell' : 'buy'; 
                    let type = 'limit';
                    let quantity = positionAMT;
                    let price = Math.round(data.price * 100) / 100;
                    let percent = target_symobl[2];

                    quantity = quantity * percent * 0.01;
                    order(symbol, side, type, quantity, price);
                } else {
                    console.log('PositionAmt is Null');
                }
            }).catch(error => {
                console.log(error);
                console.log('- Error Occur from price get Axios -');
            });
    } else {
        console.log('Position is Null');
    }
}

// 일일 PNL
// code // 1 = 당일수익, 8 = 주간 수익, 31 = 월 수익
async function get_my_pnl(code){
    var date = new Date();

    var incomeType = 'REALIZED_PNL';
    var startTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - code);  
    var endTime = Date.now();

    var endpoint = '/fapi/v1/income';
    var query = `&incomeType=${incomeType}&startTime=${startTime}&endTime=${endTime}&timestamp=${Date.now()}`;

    const res = await axios_export.binance_API(endpoint, query, method[0]);

    let today_pnl = 0;

    for ( i = 0; i < res.length; i++){
        today_pnl += parseFloat(res[i].income);
    }
    today_pnl = today_pnl.toFixed(2); // 소숫점 2자리 미만 버림

    console.log(today_pnl);
}

// 레버리지 변경
async function change_leverage(symbol, leverage){
    var endpoint = '/fapi/v1/leverage';
    var query = `&symbol=${symbol}&leverage=${leverage}&timestamp=${Date.now()}`;

    const res = await axios_export.binance_API(endpoint, query, method[1]);
}

// 격리 마진 변경
async function change_marginType(symbol, marginType){
    var endpoint = '/fapi/v1/marginType';
    var query = `&symbol=${symbol}&marginType=${marginType}&timestamp=${Date.now()}`;

    const res = await axios_export.binance_API(endpoint, query, method[1]);
}

module.exports = {
    my_balance: my_balance,
    my_account: my_account,
    post_order: post_order,
    cancel_order: cancel_order,
    get_symbol: get_symbol,
    get_close_params: get_close_params,
    closing_position: closing_position,
    get_my_pnl: get_my_pnl,
    change_leverage: change_leverage,
    change_marginType: change_marginType,
};
