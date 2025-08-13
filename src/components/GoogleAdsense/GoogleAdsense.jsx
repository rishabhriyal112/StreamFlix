import { useEffect } from 'react';

const GoogleAdsense = ({ slot = "auto", style = { width: '100%', height: '90px' } }) => {
  useEffect(() => {
    // Load AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2168382917602072';
    script.crossOrigin = 'anonymous';
    
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.head.appendChild(script);
    }

    // Initialize ad after script loads
    script.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.log('AdSense error:', err);
      }
    };

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="adsense-container my-4 flex justify-center">
      <div className="text-xs text-gray-500 text-center mb-1">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2168382917602072"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAdsense;