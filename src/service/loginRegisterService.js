require('dotenv').config();
import db from '../models/index';
import bcrypt, { hashSync } from 'bcryptjs';
import { createJWT, refreshToken, verifyToken } from '../middleware/JWTAction';
import emailService from './emailService';
import jwt from 'jsonwebtoken';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
    const hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
};

const checkEmailExist = async (userEmail) => {
    let user = await db.ThanhVien.findOne({
        where: { email: userEmail },
    });

    if (user) {
        return true;
    }
    return false;
};

const registerNewUser = async (rawUserData) => {
    try {
        //check email/phonenumber are exist
        let isEmailExist = await checkEmailExist(rawUserData.email);
        if (isEmailExist === true) {
            return {
                EM: 'The mail is already exist',
                EC: 1,
                DT: '',
            };
        }

        //hash user password
        let hashPassword = hashUserPassword(rawUserData.password);

        // create new user
        await db.ThanhVien.create({
            email: rawUserData.email,
            ten: rawUserData.name,
            matKhau: hashPassword,
            loaiTk: 'SYSTEM',
            ngaySinh: rawUserData.birthday,
            hinhAnh: '',
            tongTheoDoi: 0,
            quyen: 'USER',
        });

        return {
            EM: 'A user is create successfully!',
            EC: 0,
            DT: 'okee',
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: '',
        };
    }
};

const checkPassword = (inputPassword, hashPasswork) => {
    return bcrypt.compareSync(inputPassword, hashPasswork); // true or false
};

const handleUserLogin = async (rawData) => {
    try {
        console.log('🚀 ~ handleUserLogin ~ rawData:', rawData);
        // find email, phone exist or not
        let user = await db.ThanhVien.findOne({
            where: {
                // [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
                email: rawData.username,
                loaiTk: 'SYSTEM',
            },
        });

        if (user) {
            console.log('>>> found user with email/phone');
            let isCorrectPassword = checkPassword(rawData.password, user.matKhau);
            if (isCorrectPassword === true) {
                // khi login success sẽ tạo 1 token trả về client
                let payload = {
                    id: user.id,
                    email: user.email,
                    name: user.ten,
                    type: user.loaiTk,
                    birthday: user.ngaySinh,
                    avatar: user.hinhAnh,
                    role: user.quyen,
                };
                let access_token = createJWT(payload);
                let refresh_token = await refreshToken(payload);

                return {
                    EM: 'User Login',
                    EC: 0,
                    DT: {
                        access_token: access_token,
                        refresh_token: refresh_token,
                        user: payload,
                    },
                };
            }
        }

        return {
            EM: 'Your email/phone number or password is incorrect!',
            EC: 1,
            DT: '',
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: '',
        };
    }
};

const handleLoginBySocial = async (rawData) => {
    try {
        // find email, phone exist or not
        let user = await db.ThanhVien.findOne({
            where: {
                // [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
                email: rawData.username,
                loaiTk: rawData.type,
            },
        });

        const handleToken = async (data) => {
            let payload = {
                id: data.id,
                email: data.email,
                username: data.ten,
                type: data.loaiTk,
                birthday: data.ngaySinh,
                role: data.quyen,
            };
            let access_token = createJWT(payload);
            let refresh_token = await refreshToken(payload);

            return {
                EM: 'Fetch tokens for user login with social media account',
                EC: 0,
                DT: {
                    access_token: access_token,
                    refresh_token: refresh_token,
                    user: payload,
                },
            };
        };

        if (!user) {
            // create new user
            const res = await db.ThanhVien.create({
                email: rawData.username,
                ten: rawData.username,
                loaiTk: rawData.type,
                ngaySinh: '',
                hinhAnh: '',
                tongTheoDoi: 0,
                quyen: 'USER',
            });
            console.log('🚀 ~ handleLoginBySocial ~ res:', res);

            const data = await handleToken(res);
            return {
                EM: data.EM,
                DT: data.DT,
            };
        }

        if (user) {
            const data = await handleToken(user);
            return {
                EM: data.EM,
                DT: data.DT,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: '',
        };
    }
};

const handleRefreshToken = async (rawData) => {
    try {
        if (rawData.refresh_token) {
            let decoded = await verifyToken(rawData.refresh_token);

            return {
                EM: 'Get User by refresh token',
                DT: {
                    access_token: decoded?.access_token,
                    refresh_token: decoded?.refresh_token,
                    user: decoded?.user,
                },
            };
        }

        return {
            EM: 'Missing required refresh_token',
            EC: 1,
            DT: '',
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: '',
        };
    }
};

const handleForgotPass = async ({ email }) => {
    try {
        let user = await db.ThanhVien.findOne({
            where: { email: email, loaiTk: 'SYSTEM' },
        });
        if (!user) {
            return {
                EM: 'User not existed',
                DT: '',
            };
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        });
        const link = `http://localhost:3000/auth/reset-password/${user.id}/${token}`;

        await emailService.sendEmailForgotPassword(user.email, link);

        return {
            EM: 'Please check your email to change your password',
            DT: 'okee',
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: '',
        };
    }
};

const handleResetPass = async (id, token, password) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(
                token,
                process.env.JWT_REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) {
                        console.log(err);
                        resolve({
                            DT: '',
                            EM: 'The authentication',
                        });
                    }
                    //hash user password
                    let hashPassword = hashUserPassword(password);
                    let user = await db.ThanhVien.findOne({
                        where: { id: parseInt(id), loaiTk: 'SYSTEM' },
                    });
                    if (user) {
                        await user.update({
                            matKhau: hashPassword,
                        });
                        console.log('🚀 ~ jwt.verify ~ user:', user);

                        // return {
                        //     EM: 'Reset password success, please sign in again!',
                        //     DT: 'okee',
                        // };
                        resolve({
                            EM: 'Reset password success, please sign in again!',
                            DT: 'okee',
                        });
                    } else {
                        // return {
                        //     EM: 'User not found',
                        //     EC: 2,
                        //     DT: '',
                        // };
                        resolve({
                            EM: 'User not found',
                            EC: 2,
                            DT: '',
                        });
                    }
                }
            );
        } catch (error) {
            console.log(error);
            // return {
            //     EM: 'Something wrongs in service...',
            //     EC: -2,
            //     DT: '',
            // };
            resolve({
                EM: 'Something wrongs in service...',
                EC: -2,
                DT: '',
            });
        }
    });
};

module.exports = {
    registerNewUser,
    handleUserLogin,
    handleLoginBySocial,
    checkEmailExist,
    hashUserPassword,
    handleRefreshToken,
    handleForgotPass,
    handleResetPass,
};
