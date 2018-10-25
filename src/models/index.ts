export interface ICurrentGestures {
  events: PointerEvent[];
  prevPos: number | null;
  prevDiff: number | null;
  prevAngle: number | null;
}

export interface INodeState {
  zoom: number;
  scroll: number;
  brightness: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IFilter {
  brightness: number,
  contrast: number,
}

export interface ITransform {
  translate: {
    x: number,
    y: number,
  },
  scale: number,
}

export interface IClickedElementCenter {
  x: number,
  y: number,
};

export interface IMEDIA_ELEMENT_NODES {
  [videoId:string]: IMEDIA_ELEMENT_NODE;
};

export interface IMEDIA_ELEMENT_NODE {
  audioCtx: AudioContext | null;
  analyser: AnalyserNode | null;
  source: MediaElementAudioSourceNode | null;
};

export interface IData {
  events: IEvent[];
  total: number;
}

export interface IEvent {
  type: string;
  title: string;
  source: string;
  time: string;
  description: string;
  icon: string;
  size: string;
  data: IGraphData & IButtonsData & IImageData & ITemperatureData & IMusicData;
}

interface IGraphData {
  type: string;
  values: IGraphValues[];
}

interface IGraphValues {
  electricity: (number | string)[];
  water: (number | string)[];
  gas: (number | string)[];
}

interface IButtonsData {
  buttons: string[];
}

interface IImageData {
  image: string;
}

interface ITemperatureData {
  temperature: number;
  humidity: string;
}

interface IMusicData {
  albumcover: string;
  artist: string;
  track: {
    name: string;
    length: string;
  };
  volume: number;
}

