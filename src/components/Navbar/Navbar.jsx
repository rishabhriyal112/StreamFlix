import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Menu, X, Play } from "lucide-react";
import { getWatchlist } from "../../utils/wishlist";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Scroll handler
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    setIsScrolled(scrolled);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Update wishlist count
  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWatchlist().length);
    };
    
    updateWishlistCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateWishlistCount);
    
    // Custom event for same-tab updates
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    
    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  // Close mobile menu with escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Series", href: "/tv-shows" },
    { name: "Trending", href: "/trending" },
    { name: "My List", href: "/watchlist" }
  ];

  const handleNavigation = (href) => {
    window.location.href = href;
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black opacity-60 z-40"
            style={{ display: window.innerWidth >= 1024 ? 'none' : 'block' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
        style={{
          background: isScrolled 
            ? 'rgba(0, 0, 0, 0.95)' 
            : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.3)' : 'none'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div 
          className="w-full px-4 sm:px-6"
          style={{ 
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem'
          }}
        >
          <div 
            className="flex items-center justify-between"
            style={{ 
              height: window.innerWidth >= 1024 ? '80px' : '64px',
              minHeight: '64px'
            }}
          >
            
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <motion.button 
                className="flex items-center group focus:outline-none"
                style={{
                  gap: '12px',
                  padding: '8px',
                  borderRadius: '8px'
                }}
                onClick={() => handleNavigation('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="StreamFlix Home"
              >
                <img 
                  src="/play.png" 
                  alt="StreamFlix Logo"
                  style={{
                    width: window.innerWidth >= 1024 ? '28px' : '24px',
                    height: window.innerWidth >= 1024 ? '28px' : '24px'
                  }}
                />
                <span 
                  className="font-bold text-white tracking-tight"
                  style={{
                    fontSize: window.innerWidth >= 1024 ? '24px' : '20px',
                    lineHeight: '1'
                  }}
                >
                  StreamFlix
                </span>
              </motion.button>
            </div>

            {/* Desktop Navigation Menu - ALWAYS VISIBLE ON DESKTOP */}
            <nav 
              className="flex items-center"
              style={{
                display: window.innerWidth >= 1024 ? 'flex' : 'none',
                gap: '32px',
                marginLeft: '48px'
              }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="relative text-white font-semibold focus:outline-none group"
                  style={{
                    fontSize: '16px',
                    padding: '8px 4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#f87171'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {item.name}
                  <motion.div 
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      height: '2px',
                      background: '#ef4444',
                      transformOrigin: 'left'
                    }}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div 
              className="flex items-center"
              style={{
                gap: window.innerWidth >= 1024 ? '16px' : '12px'
              }}
            >
              {/* Search Button */}
              <motion.button 
                onClick={() => handleNavigation('/search')}
                className="text-white focus:outline-none"
                style={{
                  padding: window.innerWidth >= 1024 ? '12px' : '8px',
                  borderRadius: '50%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#f87171';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.background = 'none';
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Search"
              >
                <Search size={window.innerWidth >= 1024 ? 24 : 20} />
              </motion.button>
              
              {/* Wishlist */}
              <motion.button 
                onClick={() => handleNavigation('/watchlist')}
                className="text-white focus:outline-none relative"
                style={{
                  padding: window.innerWidth >= 1024 ? '12px' : '8px',
                  borderRadius: '50%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#f87171';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.background = 'none';
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Wishlist"
              >
                <Heart size={window.innerWidth >= 1024 ? 24 : 20} />
                {wishlistCount > 0 && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      minWidth: '18px',
                      height: '18px',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid black'
                    }}
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button 
                className="text-white focus:outline-none"
                style={{
                  display: window.innerWidth >= 1024 ? 'none' : 'flex',
                  padding: '8px',
                  borderRadius: '50%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#f87171';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.background = 'none';
                }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              style={{
                display: window.innerWidth >= 1024 ? 'none' : 'block',
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(75, 85, 99, 0.5)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div style={{ padding: '24px 16px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className="text-white font-semibold focus:outline-none"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      fontSize: '18px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#f87171';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'white';
                      e.target.style.background = 'none';
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                
                {/* Mobile Menu Extras */}
                <div style={{ borderTop: '1px solid rgba(55, 65, 81, 0.5)', paddingTop: '16px', marginTop: '24px' }}>
                  <motion.button
                    onClick={() => handleNavigation('/account')}
                    className="focus:outline-none"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      color: '#d1d5db',
                      fontWeight: '500',
                      fontSize: '16px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'white';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#d1d5db';
                      e.target.style.background = 'none';
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    whileHover={{ x: 8 }}
                  >
                    Account Settings
                  </motion.button>
                  <motion.button
                    onClick={() => handleNavigation('/help')}
                    className="focus:outline-none"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      color: '#d1d5db',
                      fontWeight: '500',
                      fontSize: '16px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'white';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#d1d5db';
                      e.target.style.background = 'none';
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    whileHover={{ x: 8 }}
                  >
                    Help Center
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>


    </>
  );
};

export default Navbar;
