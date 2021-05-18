/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  React-friendly script loader.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

const loadScript = (
  id: string,
  url: string,
): Promise<string> => (
  new Promise((resolve, reject) => {
    if (typeof window === `undefined`) reject();
    if (document.getElementById(id)) resolve(id);

    const scriptEl = document.createElement('script');

    scriptEl.id = id;
    scriptEl.src = url;
    scriptEl.async = true;
    scriptEl.addEventListener('load', () => resolve(id));

    window.document.body.appendChild(scriptEl);
  })
);

export default loadScript;
