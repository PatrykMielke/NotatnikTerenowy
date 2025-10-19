export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Note {
  id: string;
  title: string;
  image: string;
  date: string;
  description?: string;
  location?: LocationCoords;
}
export interface NotePreview {
  id: string;
  title: string;
  image: string;
  date: string;
}
