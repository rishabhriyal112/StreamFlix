import { useEffect } from 'react';

const SEO = ({ 
  title = 'StreamFlix - Watch Movies & TV Shows Online',
  description = 'Stream unlimited movies and TV shows on StreamFlix. Discover trending content, create your watchlist, and enjoy HD streaming.',
  keywords = 'movies, tv shows, streaming, watch online, netflix clone, entertainment',
  image = 'https://streamflix.netlify.app/play.png',
  url = 'https://streamflix.netlify.app'
}) => {
  const siteTitle = 'StreamFlix';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    const updateMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('og:title', fullTitle);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:url', url);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
  }, [fullTitle, description, keywords, image, url]);

  return null;
};

export default SEO;