'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                'ChiTietDanhSach', // table name
                'tieuDe', // new field name
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                }
            ),
            queryInterface.addColumn('ChiTietDanhSach', 'moTa', {
                type: Sequelize.STRING,
                allowNull: false,
            }),
            queryInterface.addColumn('ChiTietDanhSach', 'theLoai', {
                type: Sequelize.STRING,
                allowNull: false,
            }),
            queryInterface.addColumn('ChiTietDanhSach', 'linkAnh', {
                type: Sequelize.STRING,
                allowNull: false,
            }),
            queryInterface.addColumn('ChiTietDanhSach', 'linkNhac', {
                type: Sequelize.STRING,
                allowNull: false,
            }),
            queryInterface.addColumn('ChiTietDanhSach', 'tongYeuThich', {
                type: Sequelize.INTEGER,
                allowNull: false,
            }),
            queryInterface.addColumn('ChiTietDanhSach', 'tongLuotXem', {
                type: Sequelize.INTEGER,
                allowNull: false,
            }),
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
