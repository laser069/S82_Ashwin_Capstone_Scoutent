const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folderName = 'scoutant/others';
        let resourceType = 'auto';

        if (file.fieldname === 'video') {
            folderName = 'scoutant/videos';
            resourceType = 'video';
            return {
                folder: folderName,
                resource_type: resourceType,
                allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
            };
        } else if (file.fieldname === 'playerImage') {
            folderName = 'scoutant/images';
            resourceType = 'image';
            return {
                folder: folderName,
                resource_type: resourceType,
                allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            };
        }

        return {
            folder: folderName,
            resource_type: resourceType,
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB max per file
    },
});

module.exports = { cloudinary, upload };
