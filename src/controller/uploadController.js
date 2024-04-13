import multer from 'multer';
import path from 'path';
import db from '../models/index';
import uploadService from '../service/uploadService';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/tracks');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const handleUploadFileImages = async (req, res) => {
    const upload = multer({ storage: storage }).single('fileUploadImages');

    upload(req, res, function (err) {
        console.log('file upload: ', req.file);
        if (req.file) {
            return res.status(200).json({
                message: 'upload image success',
                data: req.file, // data
            });
        }
    });
};

const handleUploadFileTracks = async (req, res) => {
    const upload = multer({ storage: storage1 }).single('fileUploadTracks');

    upload(req, res, function (err) {
        console.log('file upload: ', req.file);
        if (req.file) {
            return res.status(200).json({
                message: 'upload track success',
                data: req.file, // data
            });
        }
    });
};

const uploadNewTrack = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let data = await uploadService.uploadNewTrack(token, req.body);
        return res.status(200).json({
            message: data.EM, // error message
            data: data.DT, // data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'error from server', // error message
            data: '', // data
        });
    }
};

module.exports = {
    handleUploadFileImages,
    handleUploadFileTracks,
    uploadNewTrack,
};
