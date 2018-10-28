export interface IFilter {
  brightness: number;
  contrast: number;
}

export interface ITransform {
  translate: {
    x: number,
    y: number,
  };
  scale: number;
}

export interface IClickedElementCenter {
  x: number;
  y: number;
}

export interface IMediaElementNodes {
  [videoId: string]: IMediaElementNode;
}

export interface IMediaElementNode {
  audioCtx: AudioContext | null;
  analyser: AnalyserNode | null;
  source: MediaElementAudioSourceNode | null;
}
