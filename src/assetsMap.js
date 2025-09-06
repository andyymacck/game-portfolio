// Edit these paths to match files you drop into /public
// Keep names intuitive; no need to write process.env.PUBLIC_URL in components
import pub from './utils/pub';

const assets = {
  // Vertical Slices
  slices: {
    s1: { thumb: pub('project1-thumb.jpg'), video: pub('project1.mp4') },
    s2: { thumb: pub('project2-thumb.jpg'), video: pub('project2.mp4') },
    s3: { thumb: pub('project3-thumb.jpg'), video: pub('project3.mp4') },
  },

  // Featured game
  featured: {
    thumb: pub('game-thumbnail.jpg'),
    webgl: pub('game/index.html'), // place your WebGL build folder in /public/game
    download: pub('game.zip'),
  },

  // Hackathon
  hackathon: {
    image: pub('toyz-cars.jpg'),
    placeholder: pub('certificates/udemy-placeholder.svg'),
    download: pub('downloads/toyz-cars-uefn-summary.txt'),
  },
};

export default assets;
