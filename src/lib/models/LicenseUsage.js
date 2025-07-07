// import { DataTypes } from "sequelize";
// import sequelize from "../db.js";
// import License from "./License.js";

// const LicenseUsage = sequelize.define(
//   "LicenseUsage",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     licenseId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     domain: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     deviceId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//     activatedAt: DataTypes.DATE,
//     deactivatedAt: DataTypes.DATE,
//   },
//   {
//     tableName: "license_usages",
//     timestamps: true,
//   }
// );

// // Associate
// License.hasMany(LicenseUsage, { foreignKey: "licenseId" });
// LicenseUsage.belongsTo(License, { foreignKey: "licenseId" });

// export default LicenseUsage;
