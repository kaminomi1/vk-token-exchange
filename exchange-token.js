export default async function handler(req, res) {
  // Только GET запросы
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { code } = req.query;

  if (!code) {
    res.status(400).json({ error: 'Code is required' });
    return;
  }

  try {
    // Замени на реальные значения:
    const clientId = process.env.VK_CLIENT_ID;
    const clientSecret = process.env.VK_CLIENT_SECRET;
    const redirectUri = 'https://oauth.vk.com/blank.html';

    if (!clientId || !clientSecret) {
      res.status(500).json({ error: 'Server misconfigured: missing VK_CLIENT_ID or VK_CLIENT_SECRET' });
      return;
    }

    // Обмениваем code на token
    const tokenResponse = await fetch('https://oauth.vk.com/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    const data = await tokenResponse.json();

    if (data.access_token) {
      // Возвращаем токен
      res.status(200).json({ access_token: data.access_token, user_id: data.user_id });
    } else {
      // Ошибка от VK
      res.status(400).json({ error: 'VK Error', details: data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}