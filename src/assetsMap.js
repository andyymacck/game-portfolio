// Edit these paths to match files you drop into /public
// Keep names intuitive; no need to write process.env.PUBLIC_URL in components
import pub from './utils/pub';

// Allow overriding the featured download (Touchy) with a GitHub Release asset URL at build time
// Set REACT_APP_TOUCHY_RELEASE_URL in the environment before `npm run build` to use an external link
// You can force-disable the featured download by setting REACT_APP_DISABLE_FEATURED_DOWNLOAD=1
const touchyReleaseUrl = process.env.REACT_APP_TOUCHY_RELEASE_URL;
const disableFeaturedDownload = String(process.env.REACT_APP_DISABLE_FEATURED_DOWNLOAD || '').toLowerCase() === '1'
  || String(process.env.REACT_APP_DISABLE_FEATURED_DOWNLOAD || '').toLowerCase() === 'true';

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
  video: pub('unity/BananaManSlice12.mp4'),
  // Updated to use a PDF preview just like hackathon doc
  // Link both Game Design and Technical Design documents placed in public/downloads
  gdd: pub('downloads/Game Design Document Banana Man.pdf'),
  tdd: pub('downloads/Technical Design Document BananaMan TDD.pdf')
    },
    s3: {
  thumb: pub('unreal/UnrealProj.JPG'),
      // Re-enabled after compression
      video: pub('unreal/ModernPlatformer.mp4'),
      // Modern Platformer GDD placed in public/downloads
      gdd: pub('downloads/ModernPlatformerGDD.pdf')
    },
    s4: {
      // Placeholder thumbnail not required; the card renders a styled div
      video: pub('unity/UnityCubeMiniGame.mp4')
    }
  },
  featured: {
    thumb: pub('unity/Touchy.JPG'),
    // Re-enabled after compression
    video: pub('unity/Untitled video - Made with Clipchamp.mp4'),
    // Point to archived build placed by scripts/make-featured-zip.ps1
    // Using 7z for smaller size (<100 MB)
    // Prefer a GitHub Release asset URL when provided via env var; fallback to local 7z in public/downloads
    // If downloads are disabled, set to null to show the "Coming soon" pill in UI
    download: disableFeaturedDownload ? null : (touchyReleaseUrl || null)
  },
  hackathon: {
    image: `${process.env.PUBLIC_URL}/toyz-cars.jpg`,
    placeholder: `${process.env.PUBLIC_URL}/certificates/udemy-placeholder.svg`,
    download: `${process.env.PUBLIC_URL}/downloads/ToyzCarsUEFNTechDocumentandProposal.pdf`
  }
};
