interface Fluid {
    base64: string,
    aspectRatio: number,
    src: string,
    srcSet: string,
    sizes: string
}

interface ImageSharp {
    fluid: Fluid
}

interface PostImage {
    childImageSharp: ImageSharp
}

interface PostMetadataQuery {
    title: string;
    description: string;
    image: PostImage;
    relativeDate: string;
    date: string;
}

export default PostMetadataQuery;
