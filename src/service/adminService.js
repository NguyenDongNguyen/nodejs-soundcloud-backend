require('dotenv').config();
import db from '../models/index';
import { checkEmailExist, hashUserPassword } from './loginRegisterService';
import { verifyToken } from '../middleware/JWTAction';
import { Op } from 'sequelize';

const getUserWithPagination = async (page, limit, data) => {
    try {
        console.log('🚀 ~ getUserWithPagination ~ data:', data);
        // để xđịnh ptu đầu tiên của 1 page mới (offset là ptu cuối cùng của page htai)
        let offset = (page - 1) * limit;
        const whereCondition = () => {
            if (data.email || data.name) {
                return {
                    [Op.or]: [
                        { email: { [Op.like]: '%' + data.email + '%' } },
                        { ten: { [Op.like]: '%' + data.name + '%' } },
                    ],
                };
            } else {
                return { [Op.and]: [] };
            }
        };

        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const { count, rows } = await db.ThanhVien.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition(),
            attributes: {
                exclude: ['matKhau'],
            },
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let meta = {
            current: page,
            pageSize: limit,
            pages: totalPages,
            total: count,
        };

        return {
            EM: 'Fetch user with paginate',
            DT: {
                meta: meta,
                result: rows,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            EC: 1,
            DT: [],
        };
    }
};

const createNewUser = async (data) => {
    try {
        //check email are exist
        let isEmailExist = await checkEmailExist(data.email);
        if (isEmailExist === true) {
            return {
                EM: 'The mail is already exist',
                EC: 1,
                DT: 'email error',
            };
        }

        //hash user password
        let hashPassword = hashUserPassword(data.password);

        // create new user
        const res = await db.ThanhVien.create({
            email: data.email,
            ten: data.name,
            matKhau: hashPassword,
            loaiTk: 'SYSTEM',
            ngaySinh: data.birthday,
            hinhAnh: '',
            quyen: data.role,
        });

        return {
            EM: 'A user is create successfully!',
            DT: {
                id: res.id,
                createdAt: res.createdAt,
            },
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

const updateUser = async (data) => {
    try {
        if (!data.role) {
            return {
                EM: 'Error with empty role',
                EC: 1,
                DT: '',
            };
        }
        let user = await db.ThanhVien.findOne({
            where: { id: data.id },
        });
        if (user) {
            const res = await user.update({
                email: data.email,
                ten: data.name,
                ngaySinh: data.birthday,
                quyen: data.role,
            });

            return {
                EM: 'Update user success',
                DT: {
                    id: res.id,
                    updatedAt: res.updatedAt,
                },
            };
        } else {
            return {
                EM: 'User not found',
                EC: 2,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            EC: 1,
            DT: [],
        };
    }
};

const deleteUser = async (id) => {
    try {
        console.log('🚀 ~ deleteUser ~ id:', id);

        let user = await db.ThanhVien.findOne({
            where: { id: id },
        });

        if (user) {
            const res = await user.destroy();
            return {
                EM: 'Delete user success',
                DT: {
                    id: res.id,
                },
            };
        } else {
            return {
                EM: 'User not exits',
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            DT: '',
        };
    }
};

const getTrackWithPagination = async (page, limit) => {
    try {
        // để xđịnh ptu đầu tiên của 1 page mới (offset là ptu cuối cùng của page htai)
        let offset = (page - 1) * limit;

        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const { count, rows } = await db.BaiNhac.findAndCountAll({
            offset: offset,
            limit: limit,
            where: { isPublic: true },
            // include tương tự join trong sql
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
            },
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let meta = {
            current: page,
            pageSize: limit,
            pages: totalPages,
            total: count,
        };

        return {
            EM: 'Fetch track with paginate',
            DT: {
                meta: meta,
                result: rows,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            EC: 1,
            DT: [],
        };
    }
};

const createNewTrack = async (token, data) => {
    try {
        let decoded = await verifyToken(token);

        // create new user
        const res = await db.BaiNhac.create({
            tieuDe: data.title,
            moTa: data.description,
            theLoai: data.category,
            linkAnh: data.imgUrl,
            linkNhac: data.trackUrl,
            tongYeuThich: data.countLike,
            tongLuotXem: data.countPlay,
            isPublic: data.isPublic,
            ThanhVienId: decoded?.user?.id,
        });

        return {
            EM: 'A track is create successfully!',
            DT: {
                id: res.id,
                createdAt: res.createdAt,
            },
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

//duyệt đki thành viên VIP
const updateUserVIP = async (data) => {
    try {
        if (!data.status) {
            return {
                EM: 'Error with empty status',
                DT: '',
            };
        }
        let user = await db.ThanhVienVIP.findOne({
            where: { id: data.id },
        });
        if (user) {
            const res = await user.update({
                trangThai: data.status,
            });

            return {
                EM: 'Update userVIP success',
                DT: {
                    id: res.id,
                    updatedAt: res.updatedAt,
                },
            };
        } else {
            return {
                EM: 'User not register VIP',
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            DT: [],
        };
    }
};

const getTrackUnPublic = async (page, limit, data) => {
    try {
        // để xđịnh ptu đầu tiên của 1 page mới (offset là ptu cuối cùng của page htai)
        let offset = (page - 1) * limit;

        const whereCondition = () => {
            if (data.title || data.category) {
                return {
                    isPublic: false,
                    [Op.or]: [
                        { tieuDe: { [Op.like]: '%' + data.title + '%' } },
                        { theLoai: { [Op.like]: '%' + data.category + '%' } },
                    ],
                };
            } else {
                return { isPublic: false, [Op.and]: [] };
            }
        };

        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const { count, rows } = await db.BaiNhac.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition(),
            // include tương tự join trong sql
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
            },
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let meta = {
            current: page,
            pageSize: limit,
            pages: totalPages,
            total: count,
        };

        return {
            EM: 'Fetch track unPublic with paginate',
            DT: {
                meta: meta,
                result: rows,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            EC: 1,
            DT: [],
        };
    }
};

// duyệt bài nhạc
const accessTrack = async (data) => {
    try {
        if (!data.status) {
            return {
                EM: 'Error with empty status',
                DT: '',
            };
        }
        let track = await db.BaiNhac.findOne({
            where: { id: data.id },
        });
        if (track) {
            const res = await track.update({
                isPublic: data.status,
            });

            return {
                EM: 'Update track success',
                DT: {
                    id: res.id,
                    updatedAt: res.updatedAt,
                },
            };
        } else {
            return {
                EM: 'Track not found',
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            DT: [],
        };
    }
};

const getUserVipWithPagination = async (page, limit, data) => {
    try {
        // để xđịnh ptu đầu tiên của 1 page mới (offset là ptu cuối cùng của page htai)
        let offset = (page - 1) * limit;

        const whereCondition = () => {
            if (data.email || data.name) {
                return {
                    [Op.or]: [
                        { email: { [Op.like]: '%' + data.email + '%' } },
                        { ten: { [Op.like]: '%' + data.name + '%' } },
                    ],
                };
            } else {
                return { [Op.and]: [] };
            }
        };

        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const { count, rows } = await db.ThanhVienVIP.findAndCountAll({
            offset: offset,
            limit: limit,
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
                where: whereCondition(),
            },
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let meta = {
            current: page,
            pageSize: limit,
            pages: totalPages,
            total: count,
        };

        return {
            EM: 'Fetch user VIP with paginate',
            DT: {
                meta: meta,
                result: rows,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with service',
            EC: 1,
            DT: [],
        };
    }
};

module.exports = {
    getUserWithPagination,
    createNewUser,
    updateUser,
    deleteUser,
    getTrackWithPagination,
    createNewTrack,
    updateUserVIP,
    getTrackUnPublic,
    accessTrack,
    getUserVipWithPagination,
};
