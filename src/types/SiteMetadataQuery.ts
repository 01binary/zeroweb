/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GraphQL site SEO/metadata query.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

interface SiteMetadataQuery {
  title: string,
  description: string,
  url: string,
  image: string
};

export default SiteMetadataQuery;
