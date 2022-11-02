/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GraphQL post metadata queries.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

type PostMetadataQuery = {
  title: string;
  description: string;
  image: {
    childImageSharp: {
      fluid: {
        base64: string;
        aspectRatio: number;
        src: string;
        srcSet: string;
        sizes: string;
      };
    };
  };
  author: string;
  relativeDate: string;
  date: string;
  location: string;
  locationUrl: string;
  pinned: boolean;
  tags: string[];
};

export default PostMetadataQuery;
