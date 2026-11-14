/**
 * Access Token(JWT)의 payload에서 memberId를 꺼내요.
 * 서버는 토큰의 sub(subject)에 memberId를 넣어 발급해요.
 *
 * 여기서는 서명을 검증하지 않고 내용만 읽어요.
 * 토큰이 유효한지는 인증이 필요한 API가 401로 알려줘요.
 */
export function getMemberIdFromToken(accessToken: string | null): number | null {
  if (!accessToken) return null;

  const payload = accessToken.split(".")[1];
  if (!payload) return null;

  try {
    // JWT는 base64url로 인코딩되어 있어서 base64로 바꾼 뒤 디코딩해요.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const decoded: unknown = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof decoded !== "object" || decoded === null || !("sub" in decoded)) {
      return null;
    }

    const memberId = Number(decoded.sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
