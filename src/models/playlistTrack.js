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
        }
    }
    ChiTietDanhSach.init(
        {
            DanhSachId: DataTypes.INTEGER,
            BaiNhacId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ChiTietDanhSach',
        }
    );
    return ChiTietDanhSach;
};
