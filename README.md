# Node_Binance_API

## Reference

> https://binance-docs.github.io/apidocs/futures/en/#change-log
*** 
## node_modules

> fs, axios, crypto, dotenv
> 
> [Axios](https://github.com/axios/axios) : npm install axios   
> [dotenv](https://github.com/motdotla/dotenv) : npm install dotenv --save

## Develop 

>22.04.14 19:00   
> API,Secret 텍스트파일로부터 읽어온 뒤, 서버통신 모듈 개발

>22.04.14 19:27   
> API,Secret 키를 txt 파일에서 읽는방법에서 환경변수에서 읽어오는 방법으로 변경

>22.04.15 16:45   
> 매수,매도,취소,종료 함수 기능완료 및 계정 관리용 모듈 개발

>22.04.30 08:31   
> 24h TickerFetch 함수 추가 및, 웹소켓 연동으로 실시간 업데이트 기능 추가   
> Retry를 통해, 웹소켓과 연동에 일시정 문제 발생 시 재시도기능 추가   

>22.04.30 11.04   
> 모든 포지션 종료 함수 추가   
