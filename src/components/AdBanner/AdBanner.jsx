import { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl27408235.profitableratecpm.com/913ca1436f4b9a9637b399afc231be0e/invoke.js';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="my-4 flex justify-center">
      <div id="container-913ca1436f4b9a9637b399afc231be0e"></div>
    </div>
  );
};

export default AdBanner;