interface FaceType {
  bounds: {height: number; width: number; x: number; y: number};
}

export interface User {
  name: string;
  sex: Option;
  snowFlakeId: string;
}
