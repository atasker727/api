export interface PhotoGeneric {
  imageURL: string;
  title: string;
  id: string | number;
}

export interface PhotoOfTheDayResponse {
  title: string;
  explanation: string;
  date: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  url: string;
  copyright?: string;
}

export interface PhotoOfTheDay extends PhotoGeneric {
  explanation: string;
  date: string;
  HDURL: string;
  copyright?: string;
}

interface Rover {
  id: number;
  name: string;
  landing_date: Date;
  launch_date: Date;
  status: string;
}

interface Camera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface MarsPhotoResponse {
  id: number;
  sol: number;
  camera: Camera;
  earth_date: Date;
  img_src: string;
  rover: Rover;
}

export interface MarsPhoto extends PhotoGeneric {
  id: number;
  sol: number;
  date: Date;
}

export type ALLOWED_PHOTO_TYPES = "MarsPhotos" | "POTD";

export type ALLOWED_CAMERA_TYPES =
  | "FHAZ"
  | "RHAZ"
  | "MAST"
  | "CHEMCAM"
  | "MAHLI"
  | "MARDI"
  | "NAVCAM";
