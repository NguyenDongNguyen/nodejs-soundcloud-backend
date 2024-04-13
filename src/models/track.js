'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BaiNhac extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            BaiNhac.belongsTo(models.ThanhVien);
            BaiNhac.hasMany(models.YeuThich);
            BaiNhac.hasMany(models.BinhLuan);
            BaiNhac.belongsToMany(models.DanhSachPhat, {
                through: 'ChiTietDanhSach',
                foreignKey: 'BaiNhacId',
            });
        }
    }
    BaiNhac.init(
        {
            tieuDe: DataTypes.STRING,
            moTa: DataTypes.STRING,
            theLoai: DataTypes.STRING,
            linkAnh: DataTypes.STRING,
            linkNhac: DataTypes.STRING,
            tongYeuThich: DataTypes.INTEGER,
            tongLuotXem: DataTypes.INTEGER,
            isPublic: DataTypes.BOOLEAN,
            ThanhVienId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'BaiNhac',
        }
    );
    return BaiNhac;
};
