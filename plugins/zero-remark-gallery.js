const cheerio = require(`cheerio`);

let nextGalleryId = 1;

module.exports = ({
  markdownAST,
}) => {
  markdownAST.children.forEach((node) => {
    const { type, value } = node;
    if (type !== 'html' || !value.startsWith('<gallery>')) return;

    const $ = cheerio.load(value);
    const images = [];

    $('.gatsby-resp-image-wrapper').each(function () {
      const container = $(this);
      const img = container.find(`img`);
      const title = img.attr('alt');
      const src = img.attr('src');
      const srcSet = img.attr('srcset');
      const set = srcSet.split(',').map(entry => entry.split(' ')[0]);
      const href = container.find(`.gatsby-resp-image-link`).attr('href');
      const [root, dir, id, sizeId, nameAndExtension] = href.split('/');
      const [name, extension] = nameAndExtension.split('.');
      const original = `/${dir}/${name}-${id}.${extension}`;
      images.push({ title, src, href, set, original, srcSet });
    });

    node.type = 'jsx';
    node.value = `<Gallery galleryId="gallery${nextGalleryId++}" images={${JSON.stringify(images)}} />`;
    node.children = undefined;
  });

  return markdownAST;
};
