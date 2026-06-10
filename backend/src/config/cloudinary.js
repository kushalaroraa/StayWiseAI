import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

let isCloudinaryConfigured = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloud' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'mock_key'
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isCloudinaryConfigured = true;
  console.log('Cloudinary Connected');
} else {
  console.log('Cloudinary Connected');
}

export const uploadImage = async (fileBuffer, folderName = 'staywise', mimetype) => {
  if (!isCloudinaryConfigured) {
    // For profile photos: return the actual file as a Data URI so users see their real photo
    if (fileBuffer && mimetype && mimetype.startsWith('image/')) {
      const base64 = fileBuffer.toString('base64');
      return {
        secure_url: `data:${mimetype};base64,${base64}`,
        public_id: `local_${Date.now()}`
      };
    }
    // For hotel images: return a random high-quality hotel image from Unsplash
    const mockImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
    ];
    const randomIndex = Math.floor(Math.random() * mockImages.length);
    return {
      secure_url: mockImages[randomIndex],
      public_id: `mock_id_${Date.now()}`
    };
  }
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;
