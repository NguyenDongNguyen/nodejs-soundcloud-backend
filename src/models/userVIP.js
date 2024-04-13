'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ThanhVienVIP extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ThanhVienVIP.belongsTo(models.ThanhVien);
        }
    }
    ThanhVienVIP.init(
        {
            idThanhVien: DataTypes.INTEGER,
            trangThai: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'ThanhVienVIP',
        }
    );
    return ThanhVienVIP;
};
