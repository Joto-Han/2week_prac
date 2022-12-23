'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Comments', 'postId', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint('Comments', {
      fields: ['postId'],
      type: 'foreign key',
      name: 'Posts_Comments_id_fk',
      references: {
        table: 'Posts',
        field: 'postId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Comments', 'postId');
  },
};