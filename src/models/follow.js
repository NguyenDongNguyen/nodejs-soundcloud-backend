'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TheoDoi extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            TheoDoi.belongsTo(models.ThanhVien, {
                as: 'follower',
                foreignKey: 'nguoiTheoDoiId',
            });
            TheoDoi.belongsTo(models.ThanhVien, {
                as: 'followee',
                foreignKey: 'nguoiDuocTheoDoiId',
            });
            // TheoDoi.belongsToMany(models.Project, { through: 'Project_YeuThich' });
        }
    }
    TheoDoi.init(
        {
            nguoiTheoDoiId: DataTypes.INTEGER,
            nguoiDuocTheoDoiId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'TheoDoi',
        }
    );
    return TheoDoi;
};
