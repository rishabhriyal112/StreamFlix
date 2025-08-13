import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PopupAd = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 relative w-[320px] mx-4">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Advertisement</h3>
        </div>
        
        <div 
          className="w-[300px] h-[250px] mx-auto overflow-hidden"
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
    </div>
  );
};

export default PopupAd;