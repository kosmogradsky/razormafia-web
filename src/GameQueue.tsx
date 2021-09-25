import * as React from "react";

export const GameQueue = () => {
  const videoContainerRef = React.createRef<HTMLDivElement>();

  const handleClick = React.useCallback(async () => {
    const mediaStreamBefore = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const videoTrack = mediaStreamBefore.getVideoTracks()[0]!;
    // @ts-ignore
    const mediaProcessor = new MediaStreamTrackProcessor(videoTrack);
    // @ts-ignore
    const mediaGenerator = new MediaStreamTrackGenerator({ kind: "video" });
    const mediaStreamAfter = new MediaStream([mediaGenerator]);

    const worker = new Worker("worker.js");
    worker.postMessage(
      { readable: mediaProcessor.readable, writable: mediaGenerator.writable },
      [mediaProcessor.readable, mediaGenerator.writable]
    );

    const videoBefore = document.createElement("video");
    videoBefore.autoplay = true;
    videoBefore.srcObject = mediaStreamBefore;

    const videoAfter = document.createElement("video");
    videoAfter.autoplay = true;
    videoAfter.srcObject = mediaStreamAfter;

    videoContainerRef.current!.appendChild(videoBefore);
    videoContainerRef.current!.appendChild(videoAfter);
  }, [videoContainerRef]);

  return (
    <div>
      <div ref={videoContainerRef}></div>
      <button type="button" onClick={handleClick}>
        Искать игру
      </button>
    </div>
  );
};
