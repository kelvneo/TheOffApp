const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendOffApprovedNotification = functions.firestore.document('users/{uid}/offs/{offId}').onCreate(async (snap, context) => {
  const uid = context.params.uid;
  const offId = context.params.offId;

  const deviceTokens = await db.collection('users').doc(uid).collection('notification_tokens').get();
  if (deviceTokens.empty) {
    return console.log('Unable to send notification to:', uid, 'as they do not have tokens.');
  }
  console.log(deviceTokens.size, 'tokens found for:', uid);

  const payload = {
    notification: {
      title: 'You have been awarded 0.5 off.',
      body: 'Please check the GSAB Admin for details.'
    }
  };

  const tokenIDs = deviceTokens.docs.map(val => val.id);
  const response = await admin.messaging().sendToDevice(tokenIDs, payload);
  const removeTokenPromises = [];

  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failed to send notification to', tokenIDs[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered') {
        removeTokenPromises.push(db.collection('users').doc(uid)
          .collection('notification_tokens').doc(tokenIDs[index]).delete());
      }
    }
  })
  return Promise.all(removeTokenPromises);
})


exports.sendOffPassApprovedNotification = functions.firestore.document('users/{uid}/off_pass/{offId}').onCreate(async (snap, context) => {
  const uid = context.params.uid;
  const offId = context.params.offId;

  const deviceTokens = await db.collection('users').doc(uid).collection('notification_tokens').get();
  if (deviceTokens.empty) {
    return console.log('Unable to send notification to:', uid, 'as they do not have tokens.');
  }
  console.log(deviceTokens.size, 'tokens found for:', uid);

  const payload = {
    notification: {
      title: 'Your off has been approved.',
      body: 'Please check the GSAB Admin for details.'
    }
  };

  const tokenIDs = deviceTokens.docs.map(val => val.id);
  const response = await admin.messaging().sendToDevice(tokenIDs, payload);
  const removeTokenPromises = [];

  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failed to send notification to', tokenIDs[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered') {
        removeTokenPromises.push(db.collection('users').doc(uid)
          .collection('notification_tokens').doc(tokenIDs[index]).delete());
      }
    }
  })
  return Promise.all(removeTokenPromises);
})

exports.pendingOffRecommendationNotification = functions.firestore.document('pending_offs/{offId}').onCreate(async (snap, context) => {
  const uid = snap.data().recommender;
  const offId = context.params.offId;

  const deviceTokens = await db.collection('users').doc(uid).collection('notification_tokens').get();
  if (deviceTokens.empty) {
    return console.log('Unable to send notification to:', uid, 'as they do not have tokens.');
  }
  console.log(deviceTokens.size, 'tokens found for:', uid);

  const title = 'You have a pending off to ' + ((uid === snap.data().approver) ? 'approve.' : 'recommend.');

  const payload = {
    notification: {
      title: title,
      body: 'Please check the GSAB Admin for details.'
    }
  };

  const tokenIDs = deviceTokens.docs.map(val => val.id);
  const response = await admin.messaging().sendToDevice(tokenIDs, payload);
  const removeTokenPromises = [];

  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failed to send notification to', tokenIDs[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered') {
        removeTokenPromises.push(db.collection('users').doc(uid)
          .collection('notification_tokens').doc(tokenIDs[index]).delete());
      }
    }
  })
  return Promise.all(removeTokenPromises);
})

exports.pendingOffApprovingNotification = functions.firestore.document('recommended_offs/{offId}').onCreate(async (snap, context) => {
  const uid = snap.data().recommender;
  const offId = context.params.offId;

  const deviceTokens = await db.collection('users').doc(uid).collection('notification_tokens').get();
  if (deviceTokens.empty) {
    return console.log('Unable to send notification to:', uid, 'as they do not have tokens.');
  }
  console.log(deviceTokens.size, 'tokens found for:', uid);

  const title = 'You have a pending off to approve.';

  const payload = {
    notification: {
      title: title,
      body: 'Please check the GSAB Admin for details.'
    }
  };

  const tokenIDs = deviceTokens.docs.map(val => val.id);
  const response = await admin.messaging().sendToDevice(tokenIDs, payload);
  const removeTokenPromises = [];

  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failed to send notification to', tokenIDs[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered') {
        removeTokenPromises.push(db.collection('users').doc(uid)
          .collection('notification_tokens').doc(tokenIDs[index]).delete());
      }
    }
  })
  return Promise.all(removeTokenPromises);
})

exports.pendingAwardApprovingNotification = functions.firestore.document('recommended_awards/{offId}').onCreate(async (snap, context) => {
  const uid = snap.data().recommender;
  const offId = context.params.offId;

  const deviceTokens = await db.collection('users').doc(uid).collection('notification_tokens').get();
  if (deviceTokens.empty) {
    return console.log('Unable to send notification to:', uid, 'as they do not have tokens.');
  }
  console.log(deviceTokens.size, 'tokens found for:', uid);

  const title = 'You have pending off(s) to award.';

  const payload = {
    notification: {
      title: title,
      body: 'Please check the GSAB Admin for details.'
    }
  };

  const tokenIDs = deviceTokens.docs.map(val => val.id);
  const response = await admin.messaging().sendToDevice(tokenIDs, payload);
  const removeTokenPromises = [];

  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failed to send notification to', tokenIDs[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered') {
        removeTokenPromises.push(db.collection('users').doc(uid)
          .collection('notification_tokens').doc(tokenIDs[index]).delete());
      }
    }
  })
  return Promise.all(removeTokenPromises);
})
