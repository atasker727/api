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

export interface PhotoOfTheDay {
  title: string;
  explanation: string;
  date: string;
  HDURL: string;
  imageURL: string;
  copyright?: string;
}
