/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Gallery component types
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

export type GalleryImage = {
  title: string;
  src: string;
  set: string[];
  srcSet: string;
  href: string;
  original: string;
};

export type SourceImage = {
  source: string;
  width: number;
  height: number;
};
