import admin from 'firebase-admin';
import qs from 'querystring';
import fetch from 'node-fetch';
import { NowRequest, NowResponse } from '@now/node';
import { compose, Next } from 'compose-middleware';
import { check, validationResult } from 'express-validator';

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'garden-defense',
    private_key_id: '5bf7c2ee19ba6f5a06bfb903d79e98a03e138d6e',
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: 'firebase-adminsdk-afrg3@garden-defense.iam.gserviceaccount.com',
    client_id: '117021851025152874515',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-afrg3%40garden-defense.iam.gserviceaccount.com'
  }),
  databaseURL: 'https://garden-defense.firebaseio.com'
});
const db = admin.database();

const rejectRequest = (res: NowResponse): void => {
  res.status(500).json({
    success: false
  });
};

module.exports = compose([
  // Überprüfen, ob der Endpoint mit der POST Methode aufgerufen wurde
  (req: NowRequest, res: NowResponse, next: Next): void => {
    if (req.method !== 'POST') {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    } else {
      next();
    }
  },

  // Gesendete Daten validieren
  check('name').isString(),
  check('score').isNumeric(),
  (req: NowRequest, res: NowResponse, next: Next): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
    } else {
      next();
    }
  },

  // ReCaptcha validieren
  async (req: NowRequest, res: NowResponse, next: Next): Promise<void> => {
    // Query Parameter String erstellen
    const query = qs.stringify({
      secret: process.env.RECAPTCHA_SECRET,
      response: req.body.recaptcha
    });

    try {
      // Anfrage an ReCaptcha API schicken, um response zu validieren
      const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?${query}`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      });

      // Antwort in JSON umwandeln
      const json = await response.json();

      // Testen, ob ein Mindestwert erreicht wurde
      if (json.success && json.score >= 0.5) {
        next();
      } else {
        res.status(400).json({
          success: false,
          message: 'ReCaptcha invalid'
        });
      }
    } catch (err) {
      rejectRequest(res);
    }
  },

  // Highscore in der Datenbank speichern
  async (req: NowRequest, res: NowResponse): Promise<void> => {
    try {
      // Referenz zur Collection in der Datenbank speichern
      const highscoresRef = db.ref('highscores');

      // Leerzeichen um Namen herum entfernen
      const trimmedName = req.body.name.trim();

      // Highscore speichern
      highscoresRef
        .push({
          name: trimmedName,
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
  }
]);
