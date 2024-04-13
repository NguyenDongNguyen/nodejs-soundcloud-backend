'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class YeuThich extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            YeuThich.belongsTo(models.ThanhVien);
            YeuThich.belongsTo(models.BaiNhac);
            // YeuThich.belongsToMany(models.Project, { through: 'Project_YeuThich' });
        }
    }
    YeuThich.init(
        {
            ThanhVienId: DataTypes.INTEGER,
            BaiNhacId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'YeuThich',
        }
    );
    return YeuThich;
};
