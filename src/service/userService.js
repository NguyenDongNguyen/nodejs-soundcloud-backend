import db from '../models/index';
import emailService from './emailService';

const getUserDetail = async (id) => {
    const user = await db.ThanhVien.findOne({
        where: { id: id },
        attributes: ['id', 'ThanhVienId', 'trangThai'],
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

        await emailService.sendEmailCreateOrder(data.email);

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

module.exports = {
    getUserDetail,
    updateUserClient,
    createUserVip,
    getUserVipDetail,
};
