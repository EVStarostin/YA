export interface Filter {
  brightness: number;
  contrast: number;
}

export interface Transform {
  translate: {
    x: number,
    y: number,
  };
  scale: number;
}

export interface ClickedElementCenter {
  x: number;
  y: number;
}

export interface MediaElementNodes {
  [videoId: string]: MediaElementNode;
}

export interface MediaElementNode {
  audioCtx: AudioContext | null;
  analyser: AnalyserNode | null;
  source: MediaElementAudioSourceNode | null;
}
