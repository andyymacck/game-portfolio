// Edit these paths to match files you drop into /public
// Keep names intuitive; no need to write process.env.PUBLIC_URL in components
import pub from './utils/pub';

export default {
  slices: {
    s1: {
      thumb: pub('unreal/ShooterBear.JPG'),
      video: pub('unreal/UnrealShooter1.mp4'),
      // Add a GDD PDF for slice 1 (drop the file into public/downloads/slice1-gdd.pdf)
      gdd: pub('downloads/slice1-gdd.pdf')
    },
    s2: {
  thumb: pub('unity/Bananaman.JPG'),
  video: pub('unity/BananaManVert.mp4'),
  // Updated to use a PDF preview just like hackathon doc
  gdd: pub('downloads/slice2-gdd.pdf')
    },
    s3: {
  thumb: pub('unreal/UnrealProj.JPG'),
      // Re-enabled after compression
      video: pub('unreal/ModernPlatformer.mp4')
    }
  },
  featured: {
    thumb: pub('unity/Touchy.JPG'),
    // Re-enabled after compression
    video: pub('unity/Untitled video - Made with Clipchamp.mp4'),
    // Point to archived build placed by scripts/make-featured-zip.ps1
    // If you generate 7z instead, update to 'downloads/featured-unity.7z'
    download: pub('downloads/featured-unity.zip')
  },
  hackathon: {
    image: `${process.env.PUBLIC_URL}/toyz-cars.jpg`,
    placeholder: `${process.env.PUBLIC_URL}/certificates/udemy-placeholder.svg`,
    download: `${process.env.PUBLIC_URL}/downloads/ToyzCarsUEFNTechDocumentandProposal.pdf`
  }
};
