'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChiTietDanhSach extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ChiTietDanhSach.belongsTo(models.DanhSachPhat, {
                foreignKey: 'DanhSachPhatId',
                onDelete: 'CASCADE',
            });
        }
    }
    ChiTietDanhSach.init(
        {
            DanhSachPhatId: DataTypes.INTEGER,
            BaiNhacId: DataTypes.INTEGER,
            tieuDe: DataTypes.STRING,
            moTa: DataTypes.STRING,
            theLoai: DataTypes.STRING,
            linkAnh: DataTypes.STRING,
            linkNhac: DataTypes.STRING,
            tongYeuThich: DataTypes.INTEGER,
            tongLuotXem: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ChiTietDanhSach',
        }
    );
    return ChiTietDanhSach;
};
