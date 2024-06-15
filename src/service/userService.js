import db from '../models/index';
import emailService from './emailService';

const getUserDetail = async (id) => {
    const user = await db.ThanhVien.findOne({
        where: { id: id },
    });
    if (user) {
        return {
            EM: 'Get detail user',
            DT: user,
        };
    } else {
        return {
            EM: 'User not found',
            DT: '',
        };
    }
};

const updateUserClient = async (id, data) => {
    try {
        let user = await db.ThanhVien.findOne({
            where: { id: id },
        });
        if (user) {
            const res = await user.update({
                email: data.email,
                ten: data.name,
                ngaySinh: data.birthday,
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

const createUserVip = async (data) => {
    try {
        // create new user VIP
        const res = await db.ThanhVienVIP.create({
            ThanhVienId: data.id,
            trangThai: data.status,
        });

        await emailService.sendEmailCreateUserVip(data.email);

        return {
            EM: 'Registered member vip successfully, Please wait for confirmation',
            DT: 'oke',
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

const getUserVipDetail = async (id) => {
    const user = await db.ThanhVienVIP.findOne({
        where: { ThanhVienId: id },
    });
    if (user) {
        return {
            EM: 'Get detail user VIP',
            DT: user,
        };
    } else {
        return {
            EM: 'User not found',
            DT: '',
        };
    }
};

const createFollowOrUnfollow = async (data) => {
    try {
        // tìm người được theo dõi
        let user = await db.ThanhVien.findOne({
            where: { id: data.followeeId },
        });
        if (user) {
            await user.update({
                tongTheoDoi: parseInt(user.tongTheoDoi) + parseInt(data.quantity),
            });

            let exitsFollow = await db.TheoDoi.findOne({
                where: {
                    nguoiTheoDoiId: data.followerId,
                    nguoiDuocTheoDoiId: data.followeeId,
                },
            });

            if (exitsFollow) {
                // dislike thì xoá khỏi bảng
                await exitsFollow.destroy();
            } else {
                // create new like track
                await db.TheoDoi.create({
                    nguoiTheoDoiId: data.followerId,
                    nguoiDuocTheoDoiId: data.followeeId,
                });
            }
        } else {
            return {
                EM: 'User not found',
                DT: '',
            };
        }

        return {
            EM: 'Follow/Unfollow a user',
            DT: 'oke',
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

const getListFollowByUser = async (page, limit, status, id) => {
    try {
        let offset = (page - 1) * limit;
        const whereCondition = () => {
            if (status === 'follower') {
                return { nguoiDuocTheoDoiId: id };
            } else {
                return {
                    nguoiTheoDoiId: id,
                };
            }
        };

        // findAndCountAll tìm và lấy ra (count: tổng số ptu trong DB, rows: từng ptu)
        const { count, rows } = await db.TheoDoi.findAndCountAll({
            offset: offset,
            limit: limit,
            // attributes: [],
            where: whereCondition(),
            // include tương tự join trong sql
            include: [
                {
                    model: db.ThanhVien,
                    as: 'follower',
                    required: true,
                    attributes: [
                        'id',
                        'email',
                        'ten',
                        'hinhAnh',
                        'quyen',
                        'loaiTk',
                        'tongTheoDoi',
                    ],
                },
                {
                    model: db.ThanhVien,
                    as: 'followee',
                    required: true,
                    attributes: [
                        'id',
                        'email',
                        'ten',
                        'hinhAnh',
                        'quyen',
                        'loaiTk',
                        'tongTheoDoi',
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true,
        });

        // console.log('rows: ', rows);
        // const listFollow = [];
        // rows?.forEach((item) => {
        //     listFollow.push(item?.followee);
        // });

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
    getUserDetail,
    updateUserClient,
    createUserVip,
    getUserVipDetail,
    createFollowOrUnfollow,
    getListFollowByUser,
};
