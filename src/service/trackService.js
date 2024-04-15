require('dotenv').config();
import db from '../models/index';
import { Op } from 'sequelize';
import { verifyToken } from '../middleware/JWTAction';

const getTrackByCategory = async (data) => {
    try {
        // findAndCountAll tìm và lấy ra
        const tracks = await db.BaiNhac.findAll({
            where: { theLoai: data.category, isPublic: true },
            // include tương tự join trong sql
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
            },
            order: [['id', 'DESC']],
        });

        return {
            EM: 'Get Top Track by  categories',
            DT: tracks,
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

const getTrackDetail = async (id) => {
    try {
        // findAndCountAll tìm và lấy ra
        const track = await db.BaiNhac.findOne({
            where: { id: id },
            // include tương tự join trong sql
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
            },
        });

        return {
            EM: 'Get track detail',
            DT: track,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs Get track detail',
            EC: 1,
            DT: [],
        };
    }
};

const getCommentByTrack = async (page, limit, trackId) => {
    try {
        // để xđịnh ptu đầu tiên của 1 page mới (offset là ptu cuối cùng của page htai)
        let offset = (page - 1) * limit;

        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const { count, rows } = await db.BinhLuan.findAndCountAll({
            offset: offset,
            limit: limit,
            where: { BaiNhacId: trackId },
            // include tương tự join trong sql
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
            },
            order: [['createdAt', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let meta = {
            current: page,
            pageSize: limit,
            pages: totalPages,
            total: count,
        };

        return {
            EM: 'Get Comments of a track',
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

const createCommentOnTrack = async (token, data) => {
    try {
        let decoded = await verifyToken(token);

        // create new cmomment
        const res = await db.BinhLuan.create({
            noiDung: data.content,
            thoiGianBaiNhac: data.moment,
            BaiNhacId: data.track,
            ThanhVienId: decoded?.user?.id,
        });

        return {
            EM: 'Create a new comment',
            DT: res,
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

const createLikeOrDislike = async (token, data) => {
    try {
        let decoded = await verifyToken(token);

        // create new like track
        const res = await db.YeuThich.create({
            BaiNhacId: data.track,
            ThanhVienId: decoded?.user?.id,
        });

        let track = await db.BaiNhac.findOne({
            where: { id: data.track },
        });
        if (track) {
            await track.update({
                tongYeuThich: parseInt(track.tongYeuThich) + parseInt(data.quantity),
            });
        } else {
            return {
                EM: 'track not found',
                EC: 2,
                DT: '',
            };
        }

        return {
            EM: 'Like/Dislike a track',
            DT: {
                d: 'oke',
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

const getTrackLikeByUser = async (page, limit, token) => {
    try {
        let decoded = await verifyToken(token);
        let offset = (page - 1) * limit;

        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const { count, rows } = await db.YeuThich.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: [],
            where: { ThanhVienId: decoded?.user?.id },
            // include tương tự join trong sql
            include: {
                model: db.BaiNhac,
                attributes: [
                    'id',
                    'tieuDe',
                    'moTa',
                    'theLoai',
                    'linkAnh',
                    'linkNhac',
                    'tongYeuThich',
                    'tongLuotXem',
                    'createdAt',
                    'updatedAt',
                ],
            },
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true,
        });

        const listTrack = [];
        rows?.forEach((item) => {
            listTrack.push(item?.BaiNhac);
        });

        let totalPages = Math.ceil(count / limit);
        let meta = {
            current: page,
            pageSize: limit,
            pages: totalPages,
            total: count,
        };

        return {
            EM: 'Get Track liked by a user',
            DT: {
                meta: meta,
                result: listTrack,
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

const increaseCountView = async (data) => {
    try {
        let track = await db.BaiNhac.findOne({
            where: { id: data.trackId },
        });
        if (track) {
            await track.update({
                tongLuotXem: parseInt(track.tongLuotXem) + 1,
            });

            return {
                EM: 'Increase view/play for track',
                DT: 'oke',
            };
        } else {
            return {
                EM: 'Track not found',
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

const getTrackCreatedByUser = async (data) => {
    try {
        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const res = await db.BaiNhac.findAll({
            where: { ThanhVienId: data.id },
            // include tương tự join trong sql
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
            },
        });

        return {
            EM: 'Get Track created by a user',
            DT: {
                // meta: meta,
                result: res,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs Get Track created by a user',
            EC: 1,
            DT: [],
        };
    }
};

const searchTrackWithName = async (data) => {
    try {
        const tracks = await db.BaiNhac.findAll({
            where: {
                [Op.or]: [{ tieuDe: { [Op.like]: '%' + data.title + '%' } }],
            },
            // include tương tự join trong sql
            include: {
                model: db.ThanhVien,
                attributes: ['id', 'email', 'ten', 'quyen', 'loaiTk'],
            },
            order: [['tongLuotXem', 'DESC']],
        });

        return {
            EM: 'Get Search of tracks',
            DT: tracks,
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
