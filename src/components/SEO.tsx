/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  SEO component used to render HTML page metadata.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import SiteMetadataQuery from '../types/SiteMetadataQuery';

const SEO: FC<Partial<SiteMetadataQuery>> = ({
  title: pageTitle,
  description,
  url: pageUrl,
  image: pageImage,
}) => {
  const {
    site: {
      siteMetadata: {
        title: siteTitle,
        description: siteDesc,
        url: siteUrl,
        image: siteImage,
      },
    },
  } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          description
          url
          image
        }
      }
    }
  `);

  const title = pageTitle ? `${pageTitle} - 01 Binary` : siteTitle;
  const url = pageUrl ? `${siteUrl}/${pageUrl}` : siteUrl;
  const image = pageImage || siteImage;

  return (
    <Helmet>
      <meta charSet="utf-8" />

      <title>{title}</title>

      <meta name="description" content={description || siteDesc} />

      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || siteDesc} />
      <meta property="og:image" content={image || siteImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || siteDesc} />
      <meta name="twitter:image" content={image || siteImage} />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="1" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&family=Roboto:ital@0;1&family=Roboto:ital,wght@1,300&family=Roboto+Mono:wght@500&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};

export default SEO;
