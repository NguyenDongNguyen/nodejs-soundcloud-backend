require('dotenv').config();
import db from '../models/index';
import { verifyToken } from '../middleware/JWTAction';
import { where } from 'sequelize';

const createEmptyPlaylist = async (token, data) => {
    try {
        let decoded = await verifyToken(token);

        // create new playlist
        const res = await db.DanhSachPhat.create({
            tieuDe: data.title,
            isPublic: data.isPublic,
            ThanhVienId: decoded?.user?.id,
        });

        return {
            EM: 'Create an empty playlist',
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

const updatePlaylist = async (data) => {
    try {
        let playlist = await db.DanhSachPhat.findOne({
            where: { id: data.idPlaylist },
        });
        if (playlist) {
            const track = await db.BaiNhac.findOne({
                where: { id: data.idTrack },
                raw: true,
                nest: true,
            });

            await db.ChiTietDanhSach.create({
                DanhSachPhatId: data.idPlaylist,
                BaiNhacId: track.id,
                tieuDe: track.tieuDe,
                moTa: track.moTa,
                theLoai: track.theLoai,
                linkAnh: track.linkAnh,
                linkNhac: track.linkNhac,
                tongYeuThich: track.tongYeuThich,
                tongLuotXem: track.tongLuotXem,
            });

            return {
                EM: 'Added track to playlist successfully',
                DT: 'oke',
            };
        } else {
            return {
                EM: 'Playlist not found',
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

const updateMultiTrackPlaylist = async (data) => {
    try {
        let playlist = await db.DanhSachPhat.findOne({
            where: { id: data.id },
        });
        if (playlist) {
            await db.ChiTietDanhSach.destroy({
                where: { DanhSachPhatId: data.id },
            });
            data?.tracks.map(async (item) => {
                const track = await db.BaiNhac.findOne({
                    where: { id: item },
                    raw: true,
                    nest: true,
                });

                await db.ChiTietDanhSach.create({
                    DanhSachPhatId: data.id,
                    BaiNhacId: track.id,
                    tieuDe: track.tieuDe,
                    moTa: track.moTa,
                    theLoai: track.theLoai,
                    linkAnh: track.linkAnh,
                    linkNhac: track.linkNhac,
                    tongYeuThich: track.tongYeuThich,
                    tongLuotXem: track.tongLuotXem,
                });
            });

            return {
                EM: 'Update a playlists',
                DT: 'oke',
            };
        } else {
            return {
                EM: 'Playlist not found',
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

const deleteTrackOfPlaylist = async (data) => {
    try {
        let playlist = await db.DanhSachPhat.findOne({
            where: { id: data.idPlaylist },
        });

        if (playlist) {
            await db.ChiTietDanhSach.destroy({
                where: { DanhSachPhatId: data.idPlaylist, BaiNhacId: data.idTrack },
            });

            return {
                EM: 'removed track from the playlist successfully',
                DT: 'oke',
            };
        } else {
            return {
                EM: 'playlist not exits',
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

const deletePlaylist = async (id) => {
    try {
        let playlist = await db.DanhSachPhat.findOne({
            where: { id: id },
        });

        if (playlist) {
            const res = await playlist.destroy();

            await db.ChiTietDanhSach.destroy({
                where: { DanhSachPhatId: id },
            });

            return {
                EM: 'Delete playlist success',
                DT: {
                    id: res.id,
                },
            };
        } else {
            return {
                EM: 'playlist not exits',
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

const fetchUserPlaylist = async (page, limit, id) => {
    try {
        let offset = (page - 1) * limit;
        // findAndCountAll tìm và lấy ra
        const { count, rows } = await db.DanhSachPhat.findAndCountAll({
            offset: offset,
            limit: limit,
            where: { ThanhVienId: id },
            // include tương tự join trong sql
            include: [
                {
                    model: db.ChiTietDanhSach,
                    attributes: [
                        'BaiNhacid',
                        'tieuDe',
                        'moTa',
                        'theLoai',
                        'linkAnh',
                        'linkNhac',
                        'tongYeuThich',
                        'tongLuotXem',
                    ],
                },
            ],
            order: [['id', 'DESC']],
            nest: true,
        });

        let totalPages = Math.ceil(count / limit);
        let meta = {
            current: page,
            pageSize: limit,
            pages: totalPages,
            total: count,
        };

        console.log('🚀 ~ fetchUserPlaylist ~ rows:', rows);
        return {
            EM: 'Fetch playlists of a user',
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
    createEmptyPlaylist,
    updatePlaylist,
    updateMultiTrackPlaylist,
    deleteTrackOfPlaylist,
    deletePlaylist,
    fetchUserPlaylist,
};
