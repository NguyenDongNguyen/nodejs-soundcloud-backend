import playlistService from '../service/playlistService';

const createEmptyPlaylist = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let data = await playlistService.createEmptyPlaylist(token, req.body);
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

const updatePlaylist = async (req, res) => {
    try {
        let data = await playlistService.updatePlaylist(req.body);
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

const updateMultiTrackPlaylist = async (req, res) => {
    try {
        let data = await playlistService.updateMultiTrackPlaylist(req.body);
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

const deleteTrackOfPlaylist = async (req, res) => {
    try {
        let data = await playlistService.deleteTrackOfPlaylist(req.body);
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

const deletePlaylist = async (req, res) => {
    try {
        let data = await playlistService.deletePlaylist(req.params.slug);
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

const fetchUserPlaylist = async (req, res) => {
    try {
        let page = req.query.current;
        let limit = req.query.pageSize;
        let id = req.query.id;
        // "+" convert typeof string -> number
        let data = await playlistService.fetchUserPlaylist(+page, +limit, id);
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
    createEmptyPlaylist,
    updatePlaylist,
    updateMultiTrackPlaylist,
    deleteTrackOfPlaylist,
    deletePlaylist,
    fetchUserPlaylist,
};
