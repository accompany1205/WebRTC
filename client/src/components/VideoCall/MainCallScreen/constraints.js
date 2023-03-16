export function constraints(audioInputSelect, videoSelect) {
  var front = true;
  const constraints = {
    audio: {
      // deviceId: audioInputSelect ? { exact: audioInputSelect } : "default",
      //sampleRate: 44100, // 44100 = 44.1kHz.
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl:true,
      googEchoCancellation: true,
      googNoiseSuppression: true,
      googAutoGainControl: true,
      googHighpassFilter: true,
      googTypingNoiseDetection: true,
      googNoiseReduction: true,
      googLeakyBucket:true,
     // volume: 0.9,
      //sampleSize:16, // 16bits
    },
    video: {
      // deviceId: videoSelect ? { exact: videoSelect } : undefined,
      frameRate: { min: 30, ideal: 40, max: 60 },
      cursor: "always" | "motion" | "never",
      displaySurface: "application" | "browser" | "monitor" | "window",
      facingMode: front ? "user" : "environment",
      autoGainControl: true,
      //volume:0,
    },
  };
  return constraints;
}
