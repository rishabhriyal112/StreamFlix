# 🎬 StreamFlix

> A modern, responsive streaming platform built with React and powered by TMDB API

![StreamFlix](https://img.shields.io/badge/StreamFlix-v1.0.0-red?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.10-purple?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.14-cyan?style=for-the-badge&logo=tailwindcss)

## ✨ Features

- 🎥 **Browse Movies & TV Shows** - Extensive catalog powered by TMDB
- 🔍 **Smart Search** - Real-time search with autocomplete suggestions
- ❤️ **Wishlist System** - Save your favorite content for later
- 📱 **Fully Responsive** - Perfect experience on all devices
- 🎨 **Modern UI/UX** - Sleek design with smooth animations
- 🚀 **Fast Performance** - Built with Vite for lightning-fast loading
- 🎭 **Hero Sliders** - Dynamic content showcases
- 📊 **Trending Content** - Stay updated with popular movies and shows

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **API:** The Movie Database (TMDB)
- **Routing:** React Router DOM
- **State Management:** React Hooks

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TMDB API Key ([Get it here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishabhriyal112/StreamFlix.git
   cd StreamFlix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN=your_tmdb_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
StreamFlix/
├── public/
│   └── play.png
├── src/
│   ├── components/
│   │   ├── Footer/
│   │   ├── Navbar/
│   │   └── TitleCards/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Movie/
│   │   ├── MoviesPage/
│   │   ├── Search/
│   │   ├── TVShow/
│   │   ├── TVShowsPage/
│   │   ├── Trending/
│   │   └── Watchlist/
│   ├── utils/
│   │   ├── api.js
│   │   └── wishlist.js
│   ├── hooks/
│   │   └── useWindowSize.js
│   └── App.jsx
├── .env
├── package.json
└── README.md
```

## 🎯 Key Components

### 🏠 Home Page
- Dynamic hero slider with trending content
- Multiple content categories
- Smooth animations and transitions

### 🎬 Movies & TV Shows
- Dedicated pages for movies and TV series
- Detailed information cards
- High-quality poster images

### 🔍 Search Functionality
- Real-time search results
- Autocomplete suggestions
- Filter by content type

### ❤️ Wishlist System
- Add/remove favorites
- Persistent storage
- Quick access to saved content

## 🌐 API Integration

### TMDB API Features Used:
- **Movies:** Popular, top-rated, trending
- **TV Shows:** Popular, top-rated, on-air
- **Search:** Multi-search across all content
- **Details:** Cast, crew, ratings, descriptions
- **Images:** High-quality posters and backdrops

## 🎨 Design System

- **Color Scheme:** Dark theme with red accents
- **Typography:** Clean, modern fonts
- **Layout:** Grid-based responsive design
- **Animations:** Smooth hover effects and transitions
- **Icons:** Consistent Lucide React icon set

## 📱 Responsive Design

- **Mobile First:** Optimized for mobile devices
- **Tablet Support:** Perfect tablet experience
- **Desktop:** Full-featured desktop layout
- **Touch Friendly:** Optimized for touch interactions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Deploy to Netlify
1. Build the project locally
2. Drag and drop the `dist` folder to Netlify
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the comprehensive movie and TV show data
- [React](https://reactjs.org/) for the amazing frontend framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/rishabhriyal112">Rishabh Riyal</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>