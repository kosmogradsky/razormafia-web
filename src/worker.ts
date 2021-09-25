console.log("hello from worker");

onmessage = async (event) => {
  const readable: ReadableStream = event.data.readable;
  const writable: WritableStream = event.data.writable;
  const writer = writable.getWriter();
  const reader = readable.getReader();

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

  const handleEncodedVideo = (encodedChunk: any, metadata: any) => {
    decoder.decode(encodedChunk);
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
    bitrate: 2_000_000, // 2 Mbps
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
};
