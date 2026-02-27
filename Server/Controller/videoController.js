const Video = require('../Models/videoschema');
const fs = require('fs');
const path = require('path');

exports.uploadVideo = async (req, res) => {
    console.log("Upload request received");
    try {
        console.log("Files received:", req.files);

        if (!req.files || !req.files['video'] || !req.files['playerImage']) {
            return res.status(400).json({ msg: 'Please upload both a video and a player image.' });
        }

        const videoUrl = req.files['video'][0].path;
        const playerImageUrl = req.files['playerImage'][0].path;

        console.log("Video uploaded:", videoUrl);
        console.log("Image uploaded:", playerImageUrl);

        const newVideo = new Video({
            title: req.body.playerName + ' - ' + req.body.sport,
            description: req.body.description || '',
            videoUrl: videoUrl,
            thumbnailUrl: videoUrl.replace(/\.[^/.]+$/, ".jpg"),
            playerImageUrl: playerImageUrl,
            uploadedBy: req.user.id,
            sport: req.body.sport,
            playerName: req.body.playerName,
            age: req.body.age,
            position: req.body.position,
            location: req.body.location || '',
            bio: req.body.bio || '',
        });

        await newVideo.save();
        res.status(201).json(newVideo);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// GET /api/videos/feed
// Public — paginated, filtered, sorted discovery feed for scouts
exports.getFeed = async (req, res) => {
    try {
        const {
            sport,
            position,
            location,
            minAge,
            maxAge,
            sort = 'newest',
            page = 1,
        } = req.query;

        const limit = 10;
        const skip = (parseInt(page) - 1) * limit;

        // Build filter
        const query = {};
        if (sport) query.sport = sport.toLowerCase();
        if (position) query.position = { $regex: position, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = parseInt(minAge);
            if (maxAge) query.age.$lte = parseInt(maxAge);
        }

        // Build sort
        let sortObj = { createdAt: -1 };
        if (sort === 'mostViewed') sortObj = { views: -1, createdAt: -1 };
        if (sort === 'topRated') sortObj = { age: 1, createdAt: -1 };

        const [videos, total] = await Promise.all([
            Video.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
            Video.countDocuments(query),
        ]);

        res.status(200).json({
            videos,
            total,
            page: parseInt(page),
            hasMore: skip + videos.length < total,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
