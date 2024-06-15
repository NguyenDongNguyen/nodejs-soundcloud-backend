import multer from 'multer';
import path from 'path';
import db from '../models/index';
import userService from '../service/userService';

const getUserDetail = async (req, res) => {
    try {
        let data = await userService.getUserDetail(req.params.slug);
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

const updateUserClient = async (req, res) => {
    try {
        let data = await userService.updateUserClient(req.params.slug, req.body);
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/users');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const handleUploadAvatar = async (req, res) => {
    const id = req.params.slug;
    const upload = multer({ storage: storage }).single('fileAvatar');

    upload(req, res, async function (err) {
        console.log('file upload: ', req.file);
        if (req.file) {
            let user = await db.ThanhVien.findOne({
                where: { id: id },
            });
            if (user) {
                const result = await user.update({
                    hinhAnh: req.file.filename,
                });

                return res.status(200).json({
                    message: 'upload avatar success',
                    data: req.file, // data
                });
            } else {
                return {
                    EM: 'User not found',
                    EC: 2,
                    DT: '',
                };
            }
        }
    });
};

const createUserVip = async (req, res) => {
    try {
        let data = await userService.createUserVip(req.body);
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

const getUserVipDetail = async (req, res) => {
    try {
        let data = await userService.getUserVipDetail(req.params.slug);
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

const createFollowOrUnfollow = async (req, res) => {
    try {
        let data = await userService.createFollowOrUnfollow(req.body);
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

const getListFollowByUser = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        let status = req.query.status;
        // "+" convert typeof string -> number
        let data = await userService.getListFollowByUser(
            +page,
            +limit,
            status,
            req.params.slug
        );
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
    getUserDetail,
    updateUserClient,
    handleUploadAvatar,
    createUserVip,
    getUserVipDetail,
    getListFollowByUser,
    createFollowOrUnfollow,
};
