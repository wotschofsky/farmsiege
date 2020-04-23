import admin from 'firebase-admin';
import qs from 'querystring';
import fetch from 'node-fetch';
import { NowRequest, NowResponse } from '@now/node';

import serviceAccount from './firebase-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://garden-defense.firebaseio.com'
});
const db = admin.database();

const rejectRequest = (res: NowResponse): void => {
  res.status(500).json({
    success: false
  });
};

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
    return;
  }

  const query = qs.stringify({
    secret: process.env.RECAPTCHA_SECRET,
    response: req.body.recaptcha
  });

  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?${query}`, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
  const json = await response.json();

  if (json.success && json.score >= 0.5) {
    try {
      const highscoresRef = db.ref('highscores');
      highscoresRef
        .push({
          name: req.body.name,
          score: req.body.score
        })
        .then(() => {
          res.status(200).json({
            success: true
          });
        });
    } catch (err) {
      console.error(err);
      rejectRequest(res);
    }
  } else {
    rejectRequest(res);
  }
};
