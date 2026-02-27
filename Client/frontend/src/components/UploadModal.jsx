import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance';

const UploadModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        sport: '',
        position: '',
        age: '',
        location: '',
        bio: '',
    });
    const [videoFile, setVideoFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const positionsData = {
        football: ['Winger', 'Central Midfielder', 'Striker', 'Defender', 'Fullback', 'Goalkeeper'],
        cricket: ['Batsman', 'Bowler', 'Wicket Keeper', 'All Rounder']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'sport') {
                newData.position = ''; // Reset position when sport changes
            }
            return newData;
        });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'video') setVideoFile(file);
        if (type === 'image') setImageFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Check if it's a video file
            if (e.dataTransfer.files[0].type.startsWith("video/")) {
                setVideoFile(e.dataTransfer.files[0]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile || !imageFile || !formData.sport) {
            alert("Please fill all required fields and upload both video and image.");
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('video', videoFile);
        data.append('playerImage', imageFile);
        data.append('playerName', formData.name);
        data.append('sport', formData.sport);
        data.append('position', formData.position);
        data.append('age', formData.age);
        data.append('location', formData.location);
        data.append('bio', formData.bio);

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post('/videos/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            alert('Upload Successful!');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Upload Failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                    >
                        {/* Header */}
                        <div className="p-6 text-center border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">Upload an introduction</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                For best results, video uploads should be at least 1080p in MP4 format.
                            </p>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            {/* Drag & Drop Video Area */}
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 className="text-gray-900 font-semibold mb-1">
                                    {videoFile ? videoFile.name : "Drag and drop video files to upload"}
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">Your video will be private until you publish your profile.</p>
                                <label className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                    Select files
                                    <input type="file" className="hidden" accept="video/mp4,video/mov" onChange={(e) => handleFileChange(e, 'video')} />
                                </label>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-black"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                                    <select
                                        name="sport"
                                        value={formData.sport}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black bg-transparent text-black"
                                    >
                                        <option value="">Select Sport</option>
                                        <option value="football">Football</option>
                                        <option value="cricket">Cricket</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                        <select
                                            name="position"
                                            value={formData.position}
                                            onChange={handleChange}
                                            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black bg-transparent text-black"
                                            disabled={!formData.sport}
                                        >
                                            <option value="">Select Position</option>
                                            {formData.sport && positionsData[formData.sport]?.map((pos) => (
                                                <option key={pos} value={pos}>{pos}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black text-black"
                                            placeholder="e.g. 21"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (City / Region)</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-black"
                                        placeholder="e.g. Chennai, Tamil Nadu"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Tagline</label>
                                    <input
                                        type="text"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-black"
                                        placeholder="e.g. Pacey winger with clinical finishing"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Player Image</label>
                                    <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {imageFile ? (
                                                <p className="text-sm text-gray-500">{imageFile.name}</p>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={uploading}
                                className="px-6 py-2 bg-black text-white rounded-md font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : 'Add to profile'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UploadModal;
