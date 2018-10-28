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
  electricity: Array<number | string>;
  water: Array<number | string>;
  gas: Array<number | string>;
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
