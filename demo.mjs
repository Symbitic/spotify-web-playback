import crypto from 'crypto';
import express from 'express';
import fetch from 'node-fetch';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8989;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${PORT}/callback/`;

if (!CLIENT_ID) {
  console.error('Missing CLIENT_ID');
  process.exit(1);
} else if (!CLIENT_SECRET) {
  console.error('Missing CLIENT_SECRET');
  process.exit(1);
}

function login(_req, res) {
  const buf = Buffer.alloc(16);
  const randomBytes = crypto.randomFillSync(buf).toString('hex');

  // your application requests authorization
  const scope = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state'
  ];

  const query = querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope.join('%20'),
    redirect_uri: REDIRECT_URI,
    state: randomBytes
  });

  res.redirect(`https://accounts.spotify.com/authorize?${query}`);
}

async function callback(req, res) {
  const code = req.query.code || null;
  const authToken = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });

  if (response.status !== 200) {
    console.log(`Bad response: ${response.statusText}`);
    res.type('json').send(JSON.stringify({
      'type': 'error',
      'error': 'Error while authorizing Spotify'
    }));
    return;
  }

  const { access_token } = await response.json();

  res
    .cookie('access_token', access_token, { signed: true })
    .redirect(`http://localhost:${PORT}/`);
}

async function refresh(req, res) {
  const refresh_token = req.query.refresh_token;
  const authToken = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Basic ${authToken}`
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    })
  });

  const obj = await response.json();

  res.type('json').send(JSON.stringify({
    'type': 'success',
    'data': obj.access_token
  }));
}

async function test(req, res) {
  const accessToken = req.signedCookies.access_token;

  if (accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (response.status === 200) {
      res.type('json').send(JSON.stringify({
        'type': 'success',
        'data': accessToken
      }));
    } else {
      res.type('json').send(JSON.stringify({
        'type': 'error',
        'data': 'Invalid or expired token'
      }));
    }
  } else {
    res.type('json').send(JSON.stringify({
      'type': 'error',
      'data': 'Invalid token'
    }));
  }
}

////////////////////////////////////////////////////////////////////////////////

const app = express();

app.use(express.static('public'));
app.use(express.static('dist'));
app.use(cookieParser([ 'secret1' ]));

app.get('/test', test);
app.get('/login', login);
app.get('/callback', callback);
app.get('/refresh_token', refresh);

console.log(`http://localhost:${PORT}/`);
app.listen(PORT);
