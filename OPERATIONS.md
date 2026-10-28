# JLANCER official website

서버·DB·유료 호스팅 없는 정적 홈페이지.

## Local verification

Node.js 22 이상에서 `npm run check` 및 `npm test`. 의존성 설치는 필요하지 않습니다.
미리보기: `python3 -m http.server 8000 --directory site`.
`http://localhost:8000`을 모바일(예: 390 × 844)과 PC(예: 1440 × 900)에서 확인합니다.

## Deployment (not executed)

1. 승인된 GitHub 계정에 별도의 공개 저장소 `jlancer-website`를 생성합니다.
2. 이 소스만 main 브랜치에 올립니다. 기존 참새방앗간 저장소는 사용하지 않습니다.
3. 새 저장소 Settings → Pages → Source를 GitHub Actions로 설정합니다.
4. Actions의 테스트와 배포 성공을 확인합니다.
5. Actions가 반환한 실제 HTTPS 주소를 열어 홈, 개인정보처리방침, 모바일·PC, 링크와 브라우저 콘솔을 검증합니다.

예상 주소는 `https://cozyhill72.github.io/jlancer-website/`이며 아직 생성·배포·접속 검증되지 않았습니다.
`site/`만 배포하므로 테스트와 운영 문서는 공개 웹 산출물에 포함되지 않습니다.

## Remaining content checks

- 네이버 블로그 공식 URL 미제공: 임의 링크 대신 안내문을 표시합니다. 주소 확인 후 실제 링크를 추가합니다.
- 기존 깜빡이 이미지는 현재 작업 공간에서 발견되지 않아 사용하지 않았습니다. 앱 코드는 열람하거나 복사하지 않았습니다.
- 앱 시각물은 원본 CSS 콘셉트 예시이며 실제 스크린샷으로 표시하지 않습니다.
- 개인정보처리방침은 홈페이지 범위의 초안입니다. 운영자가 실제 문의 이메일 보관 절차와 일치하는지 검수해야 합니다. 앱용 방침을 대체하지 않습니다.
- 모바일·PC 실제 브라우저 시각 검증과 배포 후 HTTP 확인은 아직 미완료입니다.

## Domain and credentials

`CNAME`을 만들지 않습니다. DNS, MX, SPF, DKIM, Google Play 소유권 인증 설정을 변경하지 않습니다.
`www.jlancer.net` 연결은 최종 검수 및 별도 승인 후 진행합니다.
비밀정보나 토큰을 파일에 저장하지 않습니다. 배포에는 GitHub Actions가 제공하는 기본 권한만 사용합니다.
