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
  handler: () => void
) => {
  if (typeof window === `undefined`) return;
  if (document.getElementById(id)) return;

  const scriptEl = document.createElement('script');

  scriptEl.id = id;
  scriptEl.src = url;
  scriptEl.async = true;
  scriptEl.addEventListener('load', handler);

  window.document.body.appendChild(scriptEl);
}

export default loadScript;
