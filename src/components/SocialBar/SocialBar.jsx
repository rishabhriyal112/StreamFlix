import { useEffect } from 'react';

const SocialBar = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl27408306.profitableratecpm.com/70/95/ac/7095ac9f7195364f10eff575e75d9ac5.js';
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default SocialBar;