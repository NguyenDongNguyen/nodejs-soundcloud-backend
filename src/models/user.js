'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ThanhVien extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ThanhVien.hasOne(models.ThanhVienVIP);
            ThanhVien.hasOne(models.BaiNhac);
            ThanhVien.hasMany(models.DanhSachPhat);
            ThanhVien.hasMany(models.YeuThich);
            ThanhVien.hasMany(models.BinhLuan);
        }
    }
    ThanhVien.init(
        {
            email: DataTypes.STRING,
            matKhau: DataTypes.STRING,
            ten: DataTypes.STRING,
            loaiTk: DataTypes.STRING,
            ngaySinh: DataTypes.STRING,
            hinhAnh: DataTypes.STRING,
            quyen: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'ThanhVien',
        }
    );
    return ThanhVien;
};
