const WebSocket = require("ws");

// const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr"); // 현물
const ws = new WebSocket("wss://fstream.binance.com/ws/!ticker@arr"); // 선물

ws.on("message", function incoming(data) {
  var sub = JSON.parse(data);                                             // 웹소켓으로 받은 데이터를 JSON 객체로 변환

  for (var i = 0; i <= sub.length; i++) {                                 // 받은 데이터의 길이까지                           
    try {
      if (sub[i].s) {                                                     // sub[i]아규먼트에 s가 있으면
        var temp = sub[i].s;                                              // temp변수에 그 해당의 심볼명을 저장
        var tempcheck = temp,substring = "USDT";                          // 저장한값에 USDT가 있는지 확인 ( substring에서 요구하는것과 일치하는지 여부를 파악하기 위함임 )
        
        // 15번쨰줄의 temp.includes(substring) 구문 = (temp변수에 substring이 포함되어있는가?)
        temp.includes(substring) ? console.log(temp + ' 가격변화 ' + (parseFloat(sub[i].p)).toFixed(2) + ' 퍼센트변화 ' + (parseFloat(sub[i].P)).toFixed(2) + ' 마지막가격 ' + (parseFloat(sub[i].c)).toFixed(2)) : "";       // 만약 USDT 들어가있으면 로그를 찍고 그렇지 않으면 패스
      }
    } catch (e) {}
  }
  //console.log(JSON.parse(data, null, 2));
});

// 정렬
// sub = sub.sort(function (a, b) {
//   return a.v > b.v ? -1 : a.v > b.v ? 1 : 0;
// });

// 내가 필요한 데이터는
// 심볼명 s, 가격변화 p, 퍼센트변화 P, 마지막가격 c

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