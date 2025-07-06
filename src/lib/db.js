import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// const sequelize = new Sequelize("stupro", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const caCert = fs.readFileSync(path.resolve("certs/ca.pem")).toString();

const sequelize = new Sequelize({
  username: process.env.AIVEN_DB_USERNAME,
  password: process.env.AIVEN_DB_PASSWORD,
  host: process.env.AIVEN_DB_HOST,
  port: 28370,
  database: "defaultdb",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: caCert,
    },
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Aiven DB connected successfully ✅"))
  .catch((error) => console.error("Aiven DB connection error ❌:", error));

export default sequelize;
