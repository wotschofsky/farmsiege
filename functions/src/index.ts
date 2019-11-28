import * as functions from 'firebase-functions'
import * as cors from 'cors'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const highscores = functions.https.onRequest((req, res) => {
   cors(req, res, () => {
      res.send('Hello from Firebase!')
   })
})
