require('dotenv').config();
import jwt from 'jsonwebtoken';

const nonSecurePaths = ['/logout', '/login', '/register'];

const createJWT = (payload) => {
    let key = process.env.JWT_ACCESS_TOKEN_SECRET;
    let access_token = null;
    try {
        access_token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_ACCESS_EXPIRE,
        });
    } catch (error) {
        console.log(error);
    }

    return access_token;
};

const refreshToken = async (payload) => {
    let key = process.env.JWT_REFRESH_TOKEN_SECRET;
    let refresh_token = null;
    try {
        refresh_token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE,
        });
    } catch (error) {
        console.log(error);
    }

    return refresh_token;
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(
                token,
                process.env.JWT_REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) {
                        console.log(err);
                        resolve({
                            status: 'ERR',
                            message: 'The authentication',
                        });
                    }
                    const payload = {
                        id: decoded?.id,
                        email: decoded?.email,
                        name: decoded?.name,
                        type: decoded?.type,
                        birthday: decoded?.birthday,
                        avatar: decoded?.avatar,
                        role: decoded?.role,
                    };
                    const access_token = await createJWT(payload);
                    const refresh_token = await refreshToken(payload);
                    resolve({
                        access_token,
                        refresh_token,
                        user: payload,
                    });
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};

const authMiddleWare = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }
        if (decoded?.role === 'ADMIN') {
            next();
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }
    });
};

module.exports = {
    createJWT,
    refreshToken,
    verifyToken,
    authMiddleWare,
};
