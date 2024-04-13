'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BinhLuan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            BinhLuan.belongsTo(models.ThanhVien);
            BinhLuan.belongsTo(models.BaiNhac);
            // BinhLuan.belongsToMany(models.Project, { through: 'Project_BinhLuan' });
        }
    }
    BinhLuan.init(
        {
            noiDung: DataTypes.STRING,
            thoiGianBaiNhac: DataTypes.INTEGER,
            ThanhVienId: DataTypes.INTEGER,
            BaiNhacId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'BinhLuan',
        }
    );
    return BinhLuan;
};
