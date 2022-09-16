# game-api



1. Tx 처리 과정
- msg[] 생성
- createTx
- encode(unSignedTx)-> db tx 컬럼에 저장 
- tx소유자의 사인(대납자x)
- broadcast 전에 db에 저장된 unSignedTx 꺼내 decode후 유저 sign Tx의 Tx Body비교

