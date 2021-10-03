import * as React from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, getIdToken } from "@firebase/auth";

declare class MediaStreamTrackGenerator extends MediaStreamTrack {
  writable: WritableStream;

  constructor(params: { kind: string });
}

export const GameQueue = () => {
  const firstVideoRef = React.useRef<HTMLVideoElement>(null);
  const secondVideoRef = React.useRef<HTMLVideoElement>(null);
  const thirdVideoRef = React.useRef<HTMLVideoElement>(null);
  const fourthVideoRef = React.useRef<HTMLVideoElement>(null);
  const fifthVideoRef = React.useRef<HTMLVideoElement>(null);
  const sixthVideoRef = React.useRef<HTMLVideoElement>(null);
  const seventhVideoRef = React.useRef<HTMLVideoElement>(null);
  const eighthVideoRef = React.useRef<HTMLVideoElement>(null);
  const ninthVideoRef = React.useRef<HTMLVideoElement>(null);
  const tenthVideoRef = React.useRef<HTMLVideoElement>(null);

  const runMediaWorker = React.useCallback(
    async ({
      videoroomId,
      slot,
      idToken,
    }: {
      videoroomId: string;
      slot: string;
      idToken: string;
    }) => {
      const ownMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const videoTrack = ownMediaStream.getVideoTracks()[0]!;
      // @ts-ignore
      const mediaProcessor = new MediaStreamTrackProcessor(videoTrack);
      const mediaGenerators = {
        first:
          slot === "first"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        second:
          slot === "second"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        third:
          slot === "third"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        fourth:
          slot === "fourth"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        fifth:
          slot === "fifth"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        sixth:
          slot === "sixth"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        seventh:
          slot === "seventh"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        eighth:
          slot === "eighth"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        ninth:
          slot === "ninth"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
        tenth:
          slot === "tenth"
            ? null
            : new MediaStreamTrackGenerator({ kind: "video" }),
      };
      const mediaStreams = {
        first:
          slot === "first" ? null : new MediaStream([mediaGenerators.first!]),
        second:
          slot === "second" ? null : new MediaStream([mediaGenerators.second!]),
        third:
          slot === "third" ? null : new MediaStream([mediaGenerators.third!]),
        fourth:
          slot === "fourth" ? null : new MediaStream([mediaGenerators.fourth!]),
        fifth:
          slot === "fifth" ? null : new MediaStream([mediaGenerators.fifth!]),
        sixth:
          slot === "sixth" ? null : new MediaStream([mediaGenerators.sixth!]),
        seventh:
          slot === "seventh"
            ? null
            : new MediaStream([mediaGenerators.seventh!]),
        eighth:
          slot === "eighth" ? null : new MediaStream([mediaGenerators.eighth!]),
        ninth:
          slot === "ninth" ? null : new MediaStream([mediaGenerators.ninth!]),
        tenth:
          slot === "tenth" ? null : new MediaStream([mediaGenerators.tenth!]),
      };

      const worker = new Worker("worker.js");
      worker.postMessage(
        {
          videoroomId,
          slot,
          idToken,
          readable: mediaProcessor.readable,
          writables: {
            first: mediaGenerators.first?.writable,
            second: mediaGenerators.second?.writable,
            third: mediaGenerators.third?.writable,
            fourth: mediaGenerators.fourth?.writable,
            fifth: mediaGenerators.fifth?.writable,
            sixth: mediaGenerators.sixth?.writable,
            seventh: mediaGenerators.seventh?.writable,
            eighth: mediaGenerators.eighth?.writable,
            ninth: mediaGenerators.ninth?.writable,
            tenth: mediaGenerators.tenth?.writable,
          },
        },
        [
          mediaProcessor.readable,
          mediaGenerators.first?.writable,
          mediaGenerators.second?.writable,
          mediaGenerators.third?.writable,
          mediaGenerators.fourth?.writable,
          mediaGenerators.fifth?.writable,
          mediaGenerators.sixth?.writable,
          mediaGenerators.seventh?.writable,
          mediaGenerators.eighth?.writable,
          mediaGenerators.ninth?.writable,
          mediaGenerators.tenth?.writable,
        ].filter((item) => item !== undefined)
      );

      firstVideoRef.current!.srcObject =
        slot === "first" ? ownMediaStream : mediaStreams.first;
      secondVideoRef.current!.srcObject =
        slot === "second" ? ownMediaStream : mediaStreams.second;
      thirdVideoRef.current!.srcObject =
        slot === "third" ? ownMediaStream : mediaStreams.third;
      fourthVideoRef.current!.srcObject =
        slot === "fourth" ? ownMediaStream : mediaStreams.fourth;
      fifthVideoRef.current!.srcObject =
        slot === "fifth" ? ownMediaStream : mediaStreams.fifth;
      sixthVideoRef.current!.srcObject =
        slot === "sixth" ? ownMediaStream : mediaStreams.sixth;
      seventhVideoRef.current!.srcObject =
        slot === "seventh" ? ownMediaStream : mediaStreams.seventh;
      eighthVideoRef.current!.srcObject =
        slot === "eighth" ? ownMediaStream : mediaStreams.eighth;
      ninthVideoRef.current!.srcObject =
        slot === "ninth" ? ownMediaStream : mediaStreams.ninth;
      tenthVideoRef.current!.srcObject =
        slot === "tenth" ? ownMediaStream : mediaStreams.tenth;
    },
    []
  );

  const handleQueue = React.useCallback(async () => {
    const startQueueing = httpsCallable(
      getFunctions(undefined, "europe-central2"),
      "startQueueing"
    );

    const response = await startQueueing();
    const result = response.data as any;

    switch (result.type) {
      case 0: {
        console.log("case 0 reached");
        break;
      }
      case 1: {
        const currentUser = getAuth().currentUser;
        if (currentUser !== null) {
          const idToken = await getIdToken(currentUser);

          runMediaWorker({
            videoroomId: result.videoroomId,
            slot: result.slot,
            idToken,
          });
        } else {
          console.log("currentUser is null");
        }
        break;
      }
      default: {
        console.log("default case reached");
        break;
      }
    }
  }, [runMediaWorker]);

  return (
    <div>
      <button type="button" onClick={handleQueue}>
        Искать игру
      </button>
      <video autoPlay={true} ref={firstVideoRef}></video>
      <video autoPlay={true} ref={secondVideoRef}></video>
      <video autoPlay={true} ref={thirdVideoRef}></video>
      <video autoPlay={true} ref={fourthVideoRef}></video>
      <video autoPlay={true} ref={fifthVideoRef}></video>
      <video autoPlay={true} ref={sixthVideoRef}></video>
      <video autoPlay={true} ref={seventhVideoRef}></video>
      <video autoPlay={true} ref={eighthVideoRef}></video>
      <video autoPlay={true} ref={ninthVideoRef}></video>
      <video autoPlay={true} ref={tenthVideoRef}></video>
    </div>
  );
};
