interface IImageSharp {
    fluid: any
}

interface IArticleImage {
    childImageSharp: IImageSharp
}

interface IArticleMetadata {
    title: string,
    description: string,
    image: IArticleImage,
    date: string,
    tags: string
}

export default IArticleMetadata;
