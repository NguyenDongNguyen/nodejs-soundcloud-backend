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

// lấy token ra từ header
// function extractToken(req) {
//     if (
//         req.headers.authorization &&
//         req.headers.authorization.split(' ')[0] === 'Bearer'
//     ) {
//         return req.headers.authorization.split(' ')[1];
//     }
//     return null;
// }

// const checkUserJWTCookies = (req, res, next) => {
//     // nếu người dùng truy cập vào url(login || regisster) thì sẽ cho next
//     if (nonSecurePaths.includes(req.path)) return next();

//     // lấy token ra từ cookies
//     let cookies = req.cookies;
//     // lấy token ra từ header
//     let tokenFromHeader = extractToken(req);

//     if ((cookies && cookies.jwt) || tokenFromHeader) {
//         let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
//         let decoded = verifyToken(token);
//         if (decoded) {
//             req.user = decoded;
//             req.token = token;
//             next();
//         } else {
//             return res.status(401).json({
//                 EC: -1,
//                 DT: '',
//                 EM: 'Not authenticated the user',
//             });
//         }
//     } else {
//         return res.status(401).json({
//             EC: -1,
//             DT: '',
//             EM: 'Not authenticated the user',
//         });
//     }
// };

// const checkUserPermission = (req, res, next) => {
//     // nếu người dùng truy cập vào url(login || regisster) thì sẽ cho next
//     if (nonSecurePaths.includes(req.path) || req.path === '/account') return next();

//     if (req.user) {
//         let email = req.user.email;
//         let roles = req.user.groupWithRoles.Roles;
//         let currentUrl = req.path;
//         if (!roles || roles.length === 0) {
//             return res.status(403).json({
//                 EC: -1,
//                 DT: '',
//                 EM: "You don't permission to access this resource...",
//             });
//         }

//         let canAccess = roles.some(
//             (item) => item.url === currentUrl || currentUrl.includes(item.url)
//         );
//         if (canAccess) {
//             next();
//         } else {
//             return res.status(403).json({
//                 EC: -1,
//                 DT: '',
//                 EM: "You don't permission to access this resource...",
//             });
//         }
//     } else {
//         return res.status(401).json({
//             EC: -1,
//             DT: '',
//             EM: 'Not authenticated the user',
//         });
//     }
// };

module.exports = {
    createJWT,
    refreshToken,
    verifyToken,
    authMiddleWare,
    // checkUserJWTCookies,
    // checkUserPermission,
};
