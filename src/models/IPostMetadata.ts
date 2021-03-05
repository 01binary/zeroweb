interface IFluid {
    base64: string,
    aspectRatio: number,
    src: string,
    srcSet: string,
    sizes: string
}

interface IImageSharp {
    fluid: IFluid
}

interface IPostImage {
    childImageSharp: IImageSharp
}

interface IPostMetadata {
    title: string,
    description: string,
    image: IPostImage,
    relativeDate: string,
    date: string
}

export default IPostMetadata;
