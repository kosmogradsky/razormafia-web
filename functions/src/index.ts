import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { nanoid } from "nanoid";

const euFunctions = functions.region("europe-central2");
const app = admin.initializeApp();

export const startQueueing = euFunctions.https.onCall((data, context) => {
  const requesterUid = context.auth?.uid;

  if (requesterUid !== undefined) {
    app
      .database()
      .ref("videorooms")
      .transaction((videorooms) => {
        const entries = Object.entries(videorooms ?? {});

        if (entries.length === 0) {
          return {
            [nanoid()]: {
              first: {
                uid: requesterUid,
              },
            },
          };
        }

        let inserted = false;

        for (const entry of entries) {
          const videoroom: any = entry![1]!;

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
              inserted = true;
              break;
            }
          }

          if (inserted) {
            break;
          }
        }

        if (inserted === false) {
          entries.push([
            nanoid(),
            {
              first: {
                uid: requesterUid,
              },
            },
          ]);
        }

        return Object.fromEntries(entries);
      });
  }
});
