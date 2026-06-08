/** All OpenWaitlist notifications go to this VoceChat user. */
export const NOTIFY_UID = "437225";

function getBaseUrl() {
  return (process.env.VOCECHAT_BASE_URL ?? "https://dev.voce.chat").replace(
    /\/$/,
    "",
  );
}

function getApiKey() {
  const key = process.env.VOCECHAT_BOT_API_KEY;
  if (!key) {
    throw new Error("VOCECHAT_BOT_API_KEY is not configured");
  }
  return key;
}

export async function sendNotification(body: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/bot/send_to_user/${NOTIFY_UID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": getApiKey(),
      "content-type": "text/plain",
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `VoceChat send_to_user failed (${response.status}): ${detail || response.statusText}`,
    );
  }

  return { uid: NOTIFY_UID, response };
}
