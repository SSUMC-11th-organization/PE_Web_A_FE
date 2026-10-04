# PE_Web_A_FE 스터디 유의사항 정리

> 출처: [SSUMC-11th-organization/PE_Web_A_FE README](https://github.com/SSUMC-11th-organization/PE_Web_A_FE)

## ⭐️ 스터디 규칙

- 워크북 노션 채우기
- 스터디 전까지 해당 주차 PR 올리기
- 제출 마감: **스터디 전날 23:59**

## 🌳 브랜치 규칙

```
├─main
    ├─닉네임/main
    │  └─닉네임/#이슈번호
```

1. PR은 root 브랜치(main)가 아닌 **`닉네임/main` 브랜치**로 보낸다.
2. 매주 워크북/실습/미션은 `닉네임/main`을 base로 삼아 `닉네임/#이슈번호` 브랜치를 생성해 작업한다.
3. 스터디원 approve 후 merge, 병합된 `닉네임/#이슈번호` 브랜치는 삭제한다. (approve/merge는 스터디 진행 중 처리)

## 📂 디렉터리 규칙

```
├─닉네임
    ├─Week1
    │  └─미션이름
    │    ├─index.html
    │    ├─index.ts
    │    └─style.css
    ├─Week2
    │  └─Week2_Mission
```

## 🔖 커밋 컨벤션

| Message  | 설명                |
| :------: | :------------------ |
| mission  | 미션 수행           |
| practice | 실습 수행           |
| workbook | 워크북 정리         |
| refactor | 코드 리팩토링       |
| fix      | 버그 수정           |
| docs     | 문서 수정           |
| comment  | 주석 추가 및 변경   |
| remove   | 파일 혹은 폴더 삭제 |
| chore    | 기타 변경사항       |

커밋 메시지 형식:
```
[week1/mission] 미션 제목
```

## 🚀 작업 순서

1. 해당 주차 이슈 확인
2. `닉네임/main` 브랜치를 원격 기준 최신 상태로 동기화
3. `닉네임/main` → `닉네임/#이슈번호` 브랜치 생성 후 작업
4. PR 올리기 전 Biome 체크 (순서대로 실행)
   ```bash
   pnpm fix        # lint/format 자동 수정
   pnpm check      # lint + format 검사
   pnpm typecheck  # TypeScript 타입 검사
   ```
5. `닉네임/#이슈번호` → `닉네임/main` 방향으로 PR 템플릿에 맞춰 PR 생성
6. 마감: 스터디 전날 23:59까지 제출 완료
