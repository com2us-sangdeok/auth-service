// todo: DB > Caching > Searching?

export enum UserEnum {
  SERVERS = '1001000501', // 서버 목록 조회
  MINT_CHARACTER_LIST = '1001000502', // 캐릭터 목록 조회
  MINT_ITEM_LIST = '1001000503', // 카테고리별 민팅 가능 아이템 정보 조회
  CONVERT_GOODS_LIST = '1001000504', // 보유 재화 수량 조회
  CONVERT_CONFIRM = '1001000505', // 보유 재화 Convert 가능 여부 확인
  CONVERT = '1001000506', // 보유 재화 수량 업데이트
  MINT_CONFIRM = '1001000507', // Minting 가능 여부 확인 & metadata 생성 요청
  MINT = '1001000508', // 민팅 요청 알림 (민팅 요청자에게 서명을 요청한 상태)
  UNLOCK_NFT = '1001000509', // 게임내 사용 불가 요청(아이템->NFT)
  LOCK_NFT = '1001000510', // 게임내 사용 가능 요청(NFT->아이템)
  TX_RESULT = '1001000511', // 결과 알림(tx 결과 전송)
}