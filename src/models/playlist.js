'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DanhSachPhat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DanhSachPhat.belongsTo(models.ThanhVien);
            DanhSachPhat.belongsToMany(models.BaiNhac, {
                through: 'ChiTietDanhSach',
                foreignKey: 'DanhSachId',
            });
        }
    }
    DanhSachPhat.init(
        {
            tieuDe: DataTypes.STRING,
            isPublic: DataTypes.BOOLEAN,
            ThanhVienId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'DanhSachPhat',
        }
    );
    return DanhSachPhat;
};
