const axios_export = require("./binanceAPI_axios");
const WebSocket = require("ws");

async function get_24h_ticker() {
  var endpoint = "/fapi/v1/ticker/24hr";
  var query = "";
  var method = "GET";

  const getInfo = async () => {
    let res = await axios_export.binance_API(endpoint, query, method);

    res = res.sort(function (a, b) {
      var highP = parseFloat(a.lastPrice);
      var lowP = parseFloat(b.lastPrice);
      return highP > lowP ? -1 : highP > lowP ? 1 : 0;
    });
    return res; //.slice(0, 3);
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
            parseFloat(sub[i].p) <= 1
              ? (res[temp_index].priceChange = sub[i].p)
              : (res[temp_index].priceChange = String(
                  parseFloat(sub[i].p).toFixed(2)
                ));
            parseFloat(sub[i].p) <= 1
              ? (res[temp_index].lastPrice = sub[i].c)
              : (res[temp_index].lastPrice = String(
                  parseFloat(sub[i].c).toFixed(2)
                ));
            res[temp_index].volume = parseFloat(sub[i].v).toFixed(2);
          }
        } catch (e) {
          console.log(e);
        }
      }
      console.table(res); // RN에서 데이터 삽입할 때 setData(data);가 들어가는 부분
    });
  })
  .catch(console.error);

// {
//     "e": "24hrTicker",  // Event type
//     "E": 123456789,     // Event time
//     "s": "BTCUSDT",     // Symbol
//     "p": "0.0015",      // Price change
//     "P": "250.00",      // Price change percent
//     "w": "0.0018",      // Weighted average price
//     "c": "0.0025",      // Last price
//     "Q": "10",          // Last quantity
//     "o": "0.0010",      // Open price
//     "h": "0.0025",      // High price
//     "l": "0.0010",      // Low price
//     "v": "10000",       // Total traded base asset volume
//     "q": "18",          // Total traded quote asset volume
//     "O": 0,             // Statistics open time
//     "C": 86400000,      // Statistics close time
//     "F": 0,             // First trade ID
//     "L": 18150,         // Last trade Id
//     "n": 18151          // Total number of trades
//   }

//res[temp_index].priceChange = parseFloat(sub[i].p).toFixed(2);
//res[temp_index].priceChangePercent = parseFloat(sub[i].P).toFixed(2);
//res[temp_index].lastPrice = parseFloat(sub[i].c).toFixed(2);
//res[temp_index].volume = parseFloat(sub[i].v).toFixed(2);

//console.table(res[temp_index])
//temp.includes(update_symbol) ? console.log(temp + ' 가격변화 ' + (parseFloat(sub[i].p)).toFixed(2) + ' 퍼센트변화 ' + (parseFloat(sub[i].P)).toFixed(2) + ' 마지막가격 ' + (parseFloat(sub[i].c)).toFixed(2)) : "";       // 만약 USDT 들어가있으면 로그를 찍고 그렇지 않으면 패스
