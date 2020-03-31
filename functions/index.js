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
      title: '0.5 Off Awarded',
      body: 'Please check The Off App for details.'
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
      title: 'Off / MA has been Approved',
      body: 'Please check The Off App for details.'
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

  const title = 'Pending Off to ' + ((uid === snap.data().approver) ? 'Approve' : 'Recommend');

  const payload = {
    notification: {
      title: title,
      body: 'Please check The Off App for details.'
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

  const title = 'Pending Off to Approve';

  const payload = {
    notification: {
      title: title,
      body: 'Please check The Off App for details.'
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

exports.pendingMARecommendationNotification = functions.firestore.document('pending_mas/{offId}').onCreate(async (snap, context) => {
  const uid = snap.data().recommender;
  const offId = context.params.offId;

  const deviceTokens = await db.collection('users').doc(uid).collection('notification_tokens').get();
  if (deviceTokens.empty) {
    return console.log('Unable to send notification to:', uid, 'as they do not have tokens.');
  }
  console.log(deviceTokens.size, 'tokens found for:', uid);

  const title = 'Pending MA to ' + ((uid === snap.data().approver) ? 'Approve' : 'Recommend');

  const payload = {
    notification: {
      title: title,
      body: 'Please check The Off App for details.'
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

exports.pendingMAApprovingNotification = functions.firestore.document('recommended_mas/{offId}').onCreate(async (snap, context) => {
  const uid = snap.data().recommender;
  const offId = context.params.offId;

  const deviceTokens = await db.collection('users').doc(uid).collection('notification_tokens').get();
  if (deviceTokens.empty) {
    return console.log('Unable to send notification to:', uid, 'as they do not have tokens.');
  }
  console.log(deviceTokens.size, 'tokens found for:', uid);

  const title = 'Pending MA to Approve';

  const payload = {
    notification: {
      title: title,
      body: 'Please check The Off App for details.'
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

  const title = 'Pending Off(s) to Award';

  const payload = {
    notification: {
      title: title,
      body: 'Please check The Off App for details.'
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
