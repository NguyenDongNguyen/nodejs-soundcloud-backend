import express from 'express';
import authController from '../controller/authController';
import adminController from '../controller/adminController';
import userController from '../controller/userController';
import trackController from '../controller/trackController';
import uploadController from '../controller/uploadController';
import playlistController from '../controller/playlistController';
import { authMiddleWare } from '../middleware/JWTAction';
const router = express.Router();

const initApiRoutes = (app) => {
    //auth
    router.post('/auth/register', authController.handleRegister);
    router.post('/auth/login', authController.handleLogin);
    router.post('/auth/refresh', authController.handleRefreshToken);
    router.post('/auth/social-media', authController.handleLoginBySocial);

    //admin
    router.post('/users', authMiddleWare, adminController.getUserWithPagination);
    router.post('/users', authMiddleWare, adminController.createNewUser);
    router.patch('/users', authMiddleWare, adminController.updateUser);
    router.delete('/users/:slug', authMiddleWare, adminController.deleteUser);
    router.get('/tracks', adminController.getTrackWithPagination);
    // router.post('/tracks', authMiddleWare, adminController.createNewTrack);
    router.patch('/users-vip', authMiddleWare, adminController.updateUserVIP);
    router.post('/tracks-unPublic', authMiddleWare, adminController.getTrackUnPublic);
    router.patch('/tracks-access', authMiddleWare, adminController.accessTrack);
    router.post(
        '/all-users-vip',
        authMiddleWare,
        adminController.getUserVipWithPagination
    );

    //user
    router.get('/users/:slug', userController.getUserDetail);
    router.patch('/users/:slug', userController.updateUserClient);
    router.post('/users/upload-avatar/:slug', userController.handleUploadAvatar);
    router.post('/users-vip', userController.createUserVip);
    router.get('/users-vip/:slug', userController.getUserVipDetail);

    //track client
    router.post('/tracks/top', trackController.getTrackByCategory);
    router.get('/tracks/:slug', trackController.getTrackDetail);
    router.post('/tracks/comments', trackController.getCommentByTrack);
    router.post('/comments', trackController.createCommentOnTrack);
    router.post('/likes', trackController.createLikeOrDislike);
    router.get('/likes', trackController.getTrackLikeByUser);
    router.post('/tracks/increase-view', trackController.increaseCountView);
    router.post('/tracks/users', trackController.getTrackCreatedByUser);
    router.post('/tracks/search', trackController.searchTrackWithName);

    //upload a new track (client)
    router.post('/files/upload-images', uploadController.handleUploadFileImages);
    router.post('/files/upload-tracks', uploadController.handleUploadFileTracks);
    router.post('/tracks', uploadController.uploadNewTrack);

    //CRUD Playlist
    router.post('/playlists/empty', playlistController.createEmptyPlaylist);
    router.patch('/playlists', playlistController.updatePlaylist);
    router.delete('/playlists/:slug', playlistController.deletePlaylist);
    router.post('/playlists/by-user', playlistController.fetchUserPlaylist);

    return app.use('/api/v1/', router);
};

export default initApiRoutes;
