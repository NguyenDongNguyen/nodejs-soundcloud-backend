'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('BaiNhac', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            tieuDe: {
                type: Sequelize.STRING,
            },
            moTa: {
                type: Sequelize.STRING,
            },
            theLoai: {
                type: Sequelize.STRING,
            },
            linkAnh: {
                type: Sequelize.STRING,
            },
            linkNhac: {
                type: Sequelize.STRING,
            },
            tongYeuThich: {
                type: Sequelize.INTEGER,
            },
            tongLuotXem: {
                type: Sequelize.INTEGER,
            },
            isPublic: {
                type: Sequelize.BOOLEAN,
            },
            ThanhVienId: {
                type: Sequelize.INTEGER,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('BaiNhac');
    },
};
