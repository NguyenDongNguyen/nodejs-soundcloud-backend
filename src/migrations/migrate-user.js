'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ThanhVien', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
            },
            matKhau: {
                type: Sequelize.STRING,
            },
            ten: {
                type: Sequelize.STRING,
            },
            loaiTk: {
                type: Sequelize.STRING,
            },
            ngaySinh: {
                type: Sequelize.STRING,
            },
            hinhAnh: {
                type: Sequelize.STRING,
            },
            quyen: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('ThanhVien');
    },
};
