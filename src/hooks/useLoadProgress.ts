/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  A thin strip progress bar shown at the top when loading
|----------------------------------------------------------
|  Copyright(C) 2022 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { useEffect } from 'react';

// Fails server render, only use in the browser
let nprogress;

if (typeof window !== `undefined`) {
  nprogress = require('accessible-nprogress');
}

const useLoadProgress = (loading: boolean) =>
  useEffect(() => {
    if (typeof window !== `undefined`) {
      if (loading) nprogress.start();
      else nprogress.done();
    }
  }, [loading]);

export default useLoadProgress;
