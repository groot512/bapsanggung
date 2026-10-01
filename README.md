# 밥상궁 BAPSANGGUNG

공식 밥상궁 로고를 적용한 모던한 한식 뷔페 브랜드 소개 홈페이지입니다.

- GitHub Pages: https://groot512.github.io/bapsanggung/
- Sites: https://bapsanggung.groot5.chatgpt.site/

## 주요 구성

브랜드 소개, 약 60종 예시 메뉴, 100평 표준 매장 갤러리, 운영 시스템, 사업 모델과 문의 데모를 제공합니다.

표준 매장은 330㎡·약 132석의 개념 설계입니다. 고객용 화장실·손씻는 공간을 다이닝으로 전환하고 보조 출입구를 추가했습니다. 3D 아이소메트릭, 2D 평면도, 3D 조감도 렌더를 탭으로 볼 수 있습니다.

## 파일 구성

- `index.html`: 홈페이지
- `styles.css`: 반응형 스타일
- `script.js`: 모바일 메뉴·도면 탭·문의 데모
- `scripts/form-validation.mjs`: 문의 입력 검증
- `assets/`: 공식 로고·매장·메뉴·도면 이미지
- `tests/site.test.mjs`: 홈페이지 회귀 검사
- `docs/previous-brand-plan.md`: 이전 기획 문서 보관본

## 실행과 검사

웹 서버로 저장소 루트를 열면 홈페이지를 볼 수 있습니다. GitHub Pages는 `main` 브랜치 루트에서 배포합니다.

```sh
node --test tests/site.test.mjs
```

문의 양식은 디자인 데모이며 입력 내용은 전송하거나 저장하지 않습니다. 이미지·도면·사업 수치는 기획용 예시입니다.
