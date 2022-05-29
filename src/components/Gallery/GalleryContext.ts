import React from 'react';
import { SourceImage } from './galleryTypes';

type GalleryContextProps = {
  sourceImages: SourceImage[];
};

const GalleryContext = React.createContext<GalleryContextProps>({
  sourceImages: [],
});

export default GalleryContext;
