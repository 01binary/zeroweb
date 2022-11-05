/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Gatsby configuration.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

// Allow using import when requiring theme
require(`ts-node`).register({ files: true });

module.exports = {
  //flags: { PRESERVE_WEBPACK_CACHE: true },
  siteMetadata: {
    title: `01 Binary: tech art`,
    titleTemplate: `%s - 01 Binary`,
    description: `Engineering and robotics projects.`,
    url: `https://www.01binary.us`,
    image: `/images/icon.png`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'zeroweb-dist',
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        displayName: false,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [`G-38HNLDCS3F`, `GTM-W229RDW`],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          anonymize_ip: true,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: [],
          // Defaults to https://www.googletagmanager.com
          origin: 'https://www.01binary.us',
        },
      },
    },
    {
      resolve: `gatsby-plugin-anchor-links`,
      options: {
        offset: -100,
      },
    },
    {
      resolve: `gatsby-plugin-react-svg`,
      options: {
        rule: {
          include: /^((?!url).)*$/,
        },
      },
    },
    {
      resolve: `gatsby-plugin-image`,
    },
    {
      resolve: `gatsby-styled-components-dark-mode`,
      options: {
        light: require(`${__dirname}/src/theme.ts`).lightTheme,
        dark: require(`${__dirname}/src/theme.ts`).darkTheme,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/images/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-remark-images`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`],
        gatsbyRemarkPlugins: [
          `gatsby-plugin-sharp`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 920,
              disableBgImageOnAlpha: true,
            },
          },
          {
            resolve: `gatsby-remark-embed-youtube`,
            options: {
              width: '100%',
              height: 400,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `downloads`,
            },
          },
          `gatsby-remark-smartypants`,
          {
            resolve: require.resolve(`./plugins/zero-remark-gallery`),
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `./src/images/`,
      },
      __key: `images`,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `./src/pages/`,
      },
      __key: `pages`,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `./src/articles/`,
      },
      __key: `articles`,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `./src/projects/`,
      },
      __key: `projects`,
    },
  ],
};
