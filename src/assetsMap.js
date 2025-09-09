// Edit these paths to match files you drop into /public
// Keep names intuitive; no need to write process.env.PUBLIC_URL in components
import pub from './utils/pub';

export default {
  slices: {
    s1: {
      thumb: pub('project1-thumb.jpg'),
      video: pub('project1.mp4')
    },
    s2: {
      thumb: pub('project2-thumb.jpg'),
      video: pub('project2.mp4')
    },
    s3: {
      thumb: pub('project3-thumb.jpg'),
      video: pub('project3.mp4')
    }
  },
  featured: {
    thumb: pub('unity/Touchy.JPG'),
    webgl: pub('unity/index.html'),
    download: pub('game.zip')
  },
  hackathon: {
    image: `${process.env.PUBLIC_URL}/toyz-cars.jpg`,
    placeholder: `${process.env.PUBLIC_URL}/certificates/udemy-placeholder.svg`,
    download: `${process.env.PUBLIC_URL}/toyz-cars-uefn-summary.txt`
  }
};
