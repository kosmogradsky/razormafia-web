import * as dgram from "dgram";

const socket = new WebSocket("ws://localhost:8000");

const convertSlotToNumber = (slot: string): number => {
  switch (slot) {
    case "first":
      return 1;
    case "second":
      return 2;
    case "third":
      return 3;
    case "fourth":
      return 4;
    case "fifth":
      return 5;
    case "sixth":
      return 6;
    case "seventh":
      return 7;
    case "eighth":
      return 8;
    case "ninth":
      return 9;
    case "tenth":
      return 10;
    default:
      throw new Error("slot out of range");
  }
};

onmessage = (event) => {
  const dgramSocket = dgram.createSocket("udp4");
  const frameToClientListeners: ((typedArray: Uint8Array) => void)[] = [];

  const onVideoroomEntered = async (response: { status: string }) => {
    if (response.status === "error") {
      console.log("error entering videoroom");
    } else {
      const readable: ReadableStream = event.data.readable;
      const writables: {
        first?: WritableStream;
        second?: WritableStream;
        third?: WritableStream;
        fourth?: WritableStream;
        fifth?: WritableStream;
        sixth?: WritableStream;
        seventh?: WritableStream;
        eighth?: WritableStream;
        ninth?: WritableStream;
        tenth?: WritableStream;
      } = {
        first: event.data.writables.first,
        second: event.data.writables.second,
        third: event.data.writables.third,
        fourth: event.data.writables.fourth,
        fifth: event.data.writables.fifth,
        sixth: event.data.writables.sixth,
        seventh: event.data.writables.seventh,
        eighth: event.data.writables.eighth,
        ninth: event.data.writables.ninth,
        tenth: event.data.writables.tenth,
      };
      console.log("writables", writables);

      for (const currentSlot of [
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
      ] as const) {
        const writer = writables[currentSlot]?.getWriter();

        if (writer === undefined) {
          console.log("writer is undefined");
        }

        if (writer !== undefined) {
          const handleFrame = (frame: any) => {
            writer.write(frame);
          };

          // @ts-ignore
          const decoder = new VideoDecoder({
            output: handleFrame,
            error: (err: any) => {
              console.log("decoder error", err);
            },
          });

          decoder.configure({
            codec: "vp8",
            codedWidth: 640,
            codedHeight: 480,
          });

          let hasKeyFrame = false;
          const listener = (typedArray: Uint8Array) => {
            const slotByte = typedArray[typedArray.length - 1];

            if (convertSlotToNumber(currentSlot) === slotByte) {
              const timestampByte1 = typedArray[typedArray.length - 6]!;
              const timestampByte2 = typedArray[typedArray.length - 5]!;
              const timestampByte3 = typedArray[typedArray.length - 4]!;
              const timestampByte4 = typedArray[typedArray.length - 3]!;
              const chunkTypeByte = typedArray[typedArray.length - 2];

              const timestampPart1 = timestampByte1;
              const timestampPart2 = timestampByte2 << 8;
              const timestampPart3 = timestampByte3 << 16;
              const timestampPart4 = timestampByte4 << 24;
              const timestamp =
                timestampPart1 &
                timestampPart2 &
                timestampPart3 &
                timestampPart4;
              const chunkType = chunkTypeByte === 1 ? "delta" : "key";

              if (hasKeyFrame === false && chunkType === "key") {
                hasKeyFrame = true;
              }

              if (hasKeyFrame) {
                // @ts-ignore
                const chunk = new EncodedVideoChunk({
                  timestamp,
                  type: chunkType,
                  data: typedArray.subarray(0, typedArray.length - 6),
                });
                decoder.decode(chunk);
              }
            }
          };
          frameToClientListeners.push(listener);
        }
      }

      const reader = readable.getReader();

      const handleEncodedVideo = (chunk: any, metadata: any) => {
        const miscLength = 6;
        const textEncoder = new TextEncoder();
        const videoroomIdBytes = textEncoder.encode(event.data.videoroomId);

        const chunkData = new Uint8Array(
          chunk.byteLength + miscLength + videoroomIdBytes.length + 1
        );
        chunk.copyTo(chunkData);

        const timestampByte1 = 0xff & chunk.timestamp;
        const timestampByte2 = 0xff & (chunk.timestamp >> 8);
        const timestampByte3 = 0xff & (chunk.timestamp >> 16);
        const timestampByte4 = 0xff & (chunk.timestamp >> 24);
        const chunkTypeByte = chunk.type === "delta" ? 1 : 2;

        chunkData.set(
          [
            timestampByte1,
            timestampByte2,
            timestampByte3,
            timestampByte4,
            chunkTypeByte,
            convertSlotToNumber(event.data.slot),
          ],
          chunk.byteLength
        );
        chunkData.set(videoroomIdBytes, chunk.byteLength + miscLength);
        chunkData.set(
          [videoroomIdBytes.length],
          chunk.byteLength + miscLength + videoroomIdBytes.length
        );

        dgramSocket.send(chunkData, 3000, "127.0.0.1");
        console.log(chunk, metadata);
      };

      const handleCodecError = (err: any) => {
        console.log("encoder error", err);
      };

      // @ts-ignore
      const videoEncoder = new VideoEncoder({
        output: handleEncodedVideo,
        error: handleCodecError,
      });
      videoEncoder.configure({
        codec: "vp8",
        width: 640,
        height: 480,
        bitrate: 1_000_000,
        framerate: 30,
      });

      let frameCounter = 0;
      while (true) {
        const result = await reader.read();

        if (result.done) break;

        const videoFrame = result.value;
        if (videoEncoder.encodeQueueSize > 2) {
          // Too many frames in flight, encoder is overwhelmed
          // let's drop this frame.
          videoFrame.close();
        } else {
          frameCounter++;
          const insert_keyframe = frameCounter % 150 == 0;
          videoEncoder.encode(videoFrame, { keyFrame: insert_keyframe });
          videoFrame.close();
        }
      }
    }
  };

  socket.onmessage = (event) => {
    if (typeof event.data === "string") {
      const response = JSON.parse(event.data);

      onVideoroomEntered(response);
    }
  };

  dgramSocket.on("message", (msg) => {
    for (const listener of frameToClientListeners) {
      const typedArray = new Uint8Array(msg);

      listener(typedArray);
    }
  });

  dgramSocket.bind(undefined, "127.0.0.1", () => {
    const sendVideoroomRequest = () => {
      socket.send(
        JSON.stringify({
          videoroomId: event.data.videoroomId,
          slot: event.data.slot,
          idToken: event.data.idToken,
          datagramPort: dgramSocket.address().port,
        })
      );
    };

    console.log("dgram address", dgramSocket.address());

    if (socket.readyState === 1) {
      sendVideoroomRequest();
    } else {
      socket.onopen = () => {
        sendVideoroomRequest();
      };
    }
  });
};
