const { test } = require('./binanceAPI_function');

var count_num = 0
const MAX_TRYS = 3; TRY_TIMEOUT = 500;

async function tryNTimes(test, count = MAX_TRYS) {
    if (count > 0) {
        const result = await test().catch(e => e);
        if (result === "Error") { return await tryNTimes(test, count - 1) }             
        return result
    }
    return `${MAX_TRYS} test failed`;
}

setInterval(() => {
    tryNTimes(test).then(console.log).catch(console.error);
    count_num += 1;
    var date = new Date();
    console.log(date + ' 반복횟수 : ' + count_num);
}, 1000);


// 6 실패시 retry 함수
// 7 재시도 횟수가 0보다 크면
// 8 test함수 결과를 result에 저장
// 9 에러 리턴하면 카운트 1 감소 후 재시도
// 10 재시도 리턴값 반환
// 15 반복진행
// 16 1초에 한번씩 반복