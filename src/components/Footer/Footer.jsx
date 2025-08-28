const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/play.png" alt="StreamFlix logo" className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold text-red-400">StreamFlix</h3>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-3">About the Website</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stream the latest movies and TV shows absolutely free. Enjoy high-quality entertainment with no ads, no sign-up, and instant access to trending content.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">Legal Disclaimer</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              We do not host any content on our servers. All media is provided by publicly available third-party services.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 StreamFlix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
