import express from 'express';
import authController from '../controller/authController';
import adminController from '../controller/adminController';
import trackController from '../controller/trackController';
import { authMiddleWare } from '../middleware/JWTAction';
const router = express.Router();

const initApiRoutes = (app) => {
    //auth
    router.post('/auth/register', authController.handleRegister);
    router.post('/auth/login', authController.handleLogin);
    router.post('/auth/refresh', authController.handleRefreshToken);
    router.post('/auth/social-media', authController.handleLoginBySocial);

    //admin
    router.get('/users', authMiddleWare, adminController.getUserWithPagination);
    router.post('/users', authMiddleWare, adminController.createNewUser);
    router.patch('/users', authMiddleWare, adminController.updateUser);
    router.delete('/users/:slug', authMiddleWare, adminController.deleteUser);
    router.get('/tracks', authMiddleWare, adminController.getTrackWithPagination);
    router.post('/tracks', authMiddleWare, adminController.createNewTrack);
    router.patch('/users-vip', authMiddleWare, adminController.updateUserVIP);
    router.patch('/tracks-access', authMiddleWare, adminController.accessTrack);

    //track client
    router.post('/tracks/top', trackController.getTrackByCategory);
    router.post('/tracks/comments', trackController.getCommentByTrack);
    router.post('/comments', trackController.createCommentOnTrack);
    router.post('/likes', trackController.createLikeOrDislike);
    router.get('/likes', trackController.getTrackLikeByUser);
    router.get('/likes', trackController.getTrackLikeByUser);
    router.post('/tracks/increase-view', trackController.increaseCountView);
    router.post('/tracks/users', trackController.getTrackCreatedByUser);
    router.post('/tracks/search', trackController.searchTrackWithName);

    return app.use('/api/v1/', router);
};

export default initApiRoutes;
