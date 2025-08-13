import { useEffect, useRef } from 'react';

const BannerAd = ({ position = 'content' }) => {
  const adRef = useRef(null);

  useEffect(() => {
    // Set global atOptions
    window.atOptions = {
      'key': '4e3f7199b144acdfd55b75afe5e4cdbc',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };

    // Create and load the ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//outlawcontinuing.com/4e3f7199b144acdfd55b75afe5e4cdbc/invoke.js';
    script.async = true;
    
    // Append to document head instead of ad container
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const getPositionStyles = () => {
    switch (position) {
      case 'sidebar':
        return 'hidden lg:block fixed top-1/2 right-4 transform -translate-y-1/2 z-40';
      case 'mobile':
        return 'block lg:hidden mx-auto my-4';
      case 'footer':
        return 'mx-auto my-6';
      default:
        return 'mx-auto my-4';
    }
  };

  return (
    <div className={`banner-ad ${getPositionStyles()}`}>
      <div className="text-xs text-gray-500 text-center mb-1">Advertisement</div>
      <div 
        ref={adRef}
        className="w-[300px] h-[250px] mx-auto min-h-[250px]"
        dangerouslySetInnerHTML={{
          __html: `
            <script type="text/javascript">
              atOptions = {
                'key' : '4e3f7199b144acdfd55b75afe5e4cdbc',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//outlawcontinuing.com/4e3f7199b144acdfd55b75afe5e4cdbc/invoke.js"></script>
          `
        }}
      />
    </div>
  );
};

export default BannerAd;