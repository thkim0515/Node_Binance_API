const axios_export = require("./binanceAPI_axios");
const axios = require("axios");
const method = ["GET", "POST", "DELETE"];

// 테스트 함수
async function test() {
  var endpoint = "/fapi/v1/ticker/24hr";
  var query = "";

  const getInfo = async () => {
    let res = await axios_export.binance_API(endpoint, query, method[0]);

    res = res.sort(function (a, b) {
      var highP = parseFloat(a.priceChangePercent);
      var lowP = parseFloat(b.priceChangePercent);
      return highP > lowP ? -1 : highP > lowP ? 1 : 0;
    });

    res = res.slice(0,2) // 배열 자르기 0번부터 4번배열까지 출력
    return res;
  };
  getInfo().then(console.table).catch(console.error());
}

// 잔고 확인
async function my_balance() {
  var endpoint = "/fapi/v2/balance";
  var query = `&timestamp=${Date.now()}`;

  await axios_export.binance_API(endpoint, query, method[0]);
}

// 보유 심볼 확인
async function my_account() {
  var endpoint = "/fapi/v2/account";
  var query = `&timestamp=${Date.now()}`;

  await axios_export.binance_API(endpoint, query, method[0]);
}

// 주문넣기
async function post_order(symbol, side, type, quantity, price) {
  var quantity = Math.abs(quantity);
  var endpoint = "/fapi/v1/order";
  var query = `symbol=${symbol.toUpperCase()}&side=${side.toUpperCase()}&type=${type.toUpperCase()}&timeInForce=GTC&quantity=${quantity}&price=${price}&recvWindow=10000&timestamp=${Date.now()}`;

  await axios_export.binance_API(endpoint, query, method[1]);
}

// 주문 취소
async function cancel_order(symbol) {
  var endpoint = "/fapi/v1/allOpenOrders";
  var query = `symbol=${symbol.toUpperCase()}&timestamp=${Date.now()}`;

  await axios_export.binance_API(endpoint, query, method[2]);
}

// 심볼 Fetch
async function get_symbol() {
  var endpoint = "/fapi/v1/ticker/price";
  var query = "";

  const getInfo = async () => {
    const res = await axios_export.binance_API(endpoint, query, method[0]);
    const symbol_list = [];
    for ( i = 0; i < res.length; i++){
        symbol_list.push(res[i].symbol);
    }
    return symbol_list;
  };
  getInfo().then(console.log).catch(console.error());
}

// 포지션 종료 [Fetch Params]
// code // 10,25,50,100 Percent Closing
async function get_close_params(symbol, code) {
  var symbolUp = symbol.toUpperCase();
  var endpoint = "/fapi/v2/account";
  var query = `&timestamp=${Date.now()}`;

  const getInfo = async () => {
    const res = await axios_export.binance_API(endpoint, query, method[0]);
    var my_position = await res.positions;
    console.log(my_position)
    var target_symbol = await my_position.filter(
      (symbol) => symbol.symbol == symbolUp
    );
    return [target_symbol, symbol, code];
  };
  
  getInfo().then(closing_position).catch(console.error());
}

// 포지션 종료 [Closing Order]
async function closing_position(target_symbol) {
  if (target_symbol) {
    let positionAMT = target_symbol[0][0].positionAmt;
    let lerverage = target_symbol[0][0].leverage
    let symbol = target_symbol[1].toUpperCase();
    let rurl = "https://fapi.binance.com/fapi/v1/ticker/price?symbol=";
    let hap = rurl + symbol;

    await axios(hap, {
      method: "GET",
    })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        if (positionAMT != 0.0) {
          let side = positionAMT >= 0 ? "sell" : "buy";
          let type = "limit";
          let quantity = positionAMT;
          let price = Math.round(data.price * 100) / 100;
          let percent = target_symbol[2];
          
          quantity = quantity * percent * lerverage * 0.001;
          post_order(symbol, side, type, quantity, price);
        } else {
          console.log("PositionAmt is Null");
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("- Error Occur from price get Axios -");
      });
  } else {
    console.log("Position is Null");
  }
}
// 일일 PNL
// code // 1 = 당일수익, 8 = 주간 수익, 31 = 월 수익
async function get_my_pnl(code) {
  var date = new Date();

  var incomeType = "REALIZED_PNL";
  var startTime = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - code
  );
  var endTime = Date.now();
  var endpoint = "/fapi/v1/income";
  var query = `&incomeType=${incomeType}&startTime=${startTime}&endTime=${endTime}&timestamp=${Date.now()}`;
  let today_pnl = 0;

  const res = await axios_export.binance_API(endpoint, query, method[0]);

  for (i = 0; i < res.length; i++) {
    today_pnl += parseFloat(res[i].income);
  }
  today_pnl = today_pnl.toFixed(2); // 소숫점 2자리 미만 버림

  console.log(today_pnl);
}

// 레버리지 변경
async function change_leverage(symbol, leverage) {
  var endpoint = "/fapi/v1/leverage";
  var query = `&symbol=${symbol}&leverage=${leverage}&timestamp=${Date.now()}`;

  const res = await axios_export.binance_API(endpoint, query, method[1]);
}

// 격리 마진 변경
async function change_marginType(symbol, marginType) {
  var endpoint = "/fapi/v1/marginType";
  var query = `&symbol=${symbol}&marginType=${marginType}&timestamp=${Date.now()}`;

  const res = await axios_export.binance_API(endpoint, query, method[1]);
}

// 24시간 티커
async function get_ticker_24h() {
  var endpoint = "/fapi/v1/ticker/24hr";
  var query = "";

  const getInfo = async () => {
    let res = await axios_export.binance_API(endpoint, query, method[0]);

    res = res.sort(function (a, b) {
      var highP = parseFloat(a.priceChangePercent);
      var lowP = parseFloat(b.priceChangePercent);
      return highP > lowP ? -1 : highP > lowP ? 1 : 0;
    });

    //res = res.slice(0,20) // 배열 자르기 0번부터 4번배열까지 출력
    return res;
  };
  getInfo().then(console.table).catch(console.error());
}

// 24시간 티커 fetch 후 프로미스 체인(Line 214) Websocket으로 데이터 업데이트
async function get_24h_ticker() {
  var endpoint = "/fapi/v1/ticker/24hr";
  var query = "";
  var method = "GET";

  const getInfo = async () => {
    let res = await axios_export.binance_API(endpoint, query, method);

    res = res.sort(function (a, b) {
      var highP = parseFloat(a.priceChangePercent);
      var lowP = parseFloat(b.priceChangePercent);
      return highP > lowP ? -1 : highP > lowP ? 1 : 0;
    });
    return res//.slice(0, 3);
  };
  return getInfo();
}

get_24h_ticker()
  .then((res) => {
    let update_symbol = res.map((item) => {
      return item.symbol;
    });
    
    const ws = new WebSocket("wss://fstream.binance.com/ws/!ticker@arr");

    ws.on("message", function incoming(data) {
      let sub = JSON.parse(data);

      for (var i = 0; i <= sub.length; i++) {
        try {
          if (sub[i]) {
            var temp = sub[i].s;
            var temp_index = update_symbol.indexOf(temp);

            res[temp_index].priceChangePercent = parseFloat(sub[i].P).toFixed(2);
            parseFloat(sub[i].p) <= 1 ? res[temp_index].priceChange = sub[i].p : res[temp_index].priceChange = String(parseFloat(sub[i].p).toFixed(2));
            parseFloat(sub[i].p) <= 1 ? res[temp_index].lastPrice = sub[i].c : res[temp_index].lastPrice = String(parseFloat(sub[i].c).toFixed(2));
            res[temp_index].volume = parseFloat(sub[i].v).toFixed(2);
            
          }
        } catch (e) {
          console.log(e);
        }
      }
      console.table(res);
    });
  })
  .catch(console.error);


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
  test: test,
  get_ticker_24h: get_ticker_24h,
};
