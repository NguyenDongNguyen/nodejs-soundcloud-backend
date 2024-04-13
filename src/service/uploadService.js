require('dotenv').config();
import db from '../models/index';
import { verifyToken } from '../middleware/JWTAction';

const uploadNewTrack = async (token, data) => {
    try {
        let decoded = await verifyToken(token);

        // create new user
        const res = await db.BaiNhac.create({
            tieuDe: data.title,
            moTa: data.description,
            theLoai: data.category,
            linkAnh: data.imgUrl,
            linkNhac: data.trackUrl,
            tongYeuThich: 0,
            tongLuotXem: 0,
            isPublic: false,
            ThanhVienId: decoded?.user?.id,
        });

        return {
            EM: 'A track is uploaded successfully, please wait admin accept',
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

module.exports = {
    uploadNewTrack,
};
