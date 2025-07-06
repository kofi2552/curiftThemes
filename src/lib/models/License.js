import { DataTypes } from "sequelize";
import sequelize from "../db.js"; // Adjust the path as necessary

const License = sequelize.define(
  "License",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customer: DataTypes.STRING,
    email: DataTypes.STRING,
    domain: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activatedAt: DataTypes.DATE,
  },
  {
    tableName: "curiftthemeslicenses", // optional: ensures table name
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default License;

// License.sync({ alter: true })
//   .then(() => {
//     console.log("License table created or updated");
//   })
//   .catch((error) => {
//     console.error("Error creating or updating License table:", error);
//   });
