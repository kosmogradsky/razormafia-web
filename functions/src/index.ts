import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const euFunctions = functions.region("europe-central2");
const app = admin.initializeApp();

export const startQueueing = euFunctions.https.onCall(async (data, context) => {
  const requesterUid = context.auth?.uid;

  if (requesterUid !== undefined) {
    return await app.firestore().runTransaction(async (transaction) => {
      const createVideoroom = () => {
        const docRef = app.firestore().collection("videorooms").doc();

        transaction.create(docRef, {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          first: {
            uid: requesterUid,
          },
        });

        return { type: 1, videoroomId: docRef.id, slot: "first" };
      };

      const lastCreatedVideoroom = await transaction.get(
        app
          .firestore()
          .collection("videorooms")
          .orderBy("createdAt", "desc")
          .limit(1)
      );

      if (lastCreatedVideoroom.empty) {
        return createVideoroom();
      }

      const videoroomId = lastCreatedVideoroom.docs[0]!.id;
      const videoroom = lastCreatedVideoroom.docs[0]!.data();

      for (const slot of [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
      ]) {
        if (videoroom[slot] === undefined) {
          videoroom[slot] = {
            uid: requesterUid,
          };
          transaction.set(
            app.firestore().collection("videorooms").doc(videoroomId),
            videoroom
          );

          return { type: 1, videoroomId, slot };
        }
      }

      return createVideoroom();
    });
  }

  return { type: 0 };
});
