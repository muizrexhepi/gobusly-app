export interface Station {
  _id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  location: ILocation;
  code: string;
}

export interface ILocation {
  lat?: number;
  lng?: number;
}
