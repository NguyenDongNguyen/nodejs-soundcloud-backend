import adminService from '../service/adminService';

// Module users
const getUserWithPagination = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        // "+" convert typeof string -> number
        let data = await adminService.getUserWithPagination(+page, +limit, req?.body);
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

const createNewUser = async (req, res) => {
    try {
        let data = await adminService.createNewUser(req.body);
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

const updateUser = async (req, res) => {
    try {
        let data = await adminService.updateUser(req.body);
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

const deleteUser = async (req, res) => {
    try {
        let data = await adminService.deleteUser(req.params.slug);
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

//CRUD tracks

const getTrackWithPagination = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        // "+" convert typeof string -> number
        let data = await adminService.getTrackWithPagination(+page, +limit);
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

const updateTrack = async (req, res) => {
    try {
        let data = await adminService.updateTrack(req.body);
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

const updateUserVIP = async (req, res) => {
    try {
        let data = await adminService.updateUserVIP(req.body);
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

const getTrackUnPublic = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        // "+" convert typeof string -> number
        let data = await adminService.getTrackUnPublic(+page, +limit, req.body);
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

const accessTrack = async (req, res) => {
    try {
        let data = await adminService.accessTrack(req.body);
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

const getUserVipWithPagination = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        // "+" convert typeof string -> number
        let data = await adminService.getUserVipWithPagination(+page, +limit, req.body);
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
    getUserWithPagination,
    createNewUser,
    updateUser,
    deleteUser,
    getTrackWithPagination,
    updateTrack,
    updateUserVIP,
    getTrackUnPublic,
    accessTrack,
    getUserVipWithPagination,
};
