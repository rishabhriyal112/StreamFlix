import { useEffect } from 'react';

const Popunder = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl27408283.profitableratecpm.com/4f/0d/6d/4f0d6d0963a9e63e94871939ed1abe97.js';
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default Popunder;