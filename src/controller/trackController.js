import trackService from '../service/trackService';

const getTrackByCategory = async (req, res) => {
    try {
        let data = await trackService.getTrackByCategory(req.body);
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

const getTrackDetail = async (req, res) => {
    try {
        let data = await trackService.getTrackDetail(req.params.slug);
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

const getCommentByTrack = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        let trackId = req.query.trackId;
        // "+" convert typeof string -> number
        let data = await trackService.getCommentByTrack(
            +page,
            +limit,
            trackId,
            req?.body
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

const createCommentOnTrack = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let data = await trackService.createCommentOnTrack(token, req.body);
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

const createLikeOrDislike = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let data = await trackService.createLikeOrDislike(token, req.body);
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

const getTrackLikeByUser = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        const token = req.headers.authorization.split(' ')[1];
        console.log('🚀 ~ getTrackLikeByUser ~ token:', token);
        // "+" convert typeof string -> number
        let data = await trackService.getTrackLikeByUser(+page, +limit, token);
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

const increaseCountView = async (req, res) => {
    try {
        let data = await trackService.increaseCountView(req.body);
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

const getTrackCreatedByUser = async (req, res) => {
    try {
        // "+" convert typeof string -> number
        let data = await trackService.getTrackCreatedByUser(req.body);
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

const searchTrackWithName = async (req, res) => {
    try {
        let data = await trackService.searchTrackWithName(req.body);
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
    getTrackByCategory,
    getTrackDetail,
    getCommentByTrack,
    createCommentOnTrack,
    createLikeOrDislike,
    getTrackLikeByUser,
    increaseCountView,
    getTrackCreatedByUser,
    searchTrackWithName,
};
