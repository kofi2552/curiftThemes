import { Sequelize } from "sequelize";
import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
import { Buffer } from "buffer";

dotenv.config();

// const sequelize = new Sequelize("stupro", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

import pg from "pg";

// const caCert = fs.readFileSync(path.resolve("certs/ca.pem")).toString();
const caCert = Buffer.from(process.env.AIVEN_CA_CERT, "base64").toString(
  "utf-8"
);

const sequelize = new Sequelize({
  username: process.env.AIVEN_DB_USERNAME,
  password: process.env.AIVEN_DB_PASSWORD,
  host: process.env.AIVEN_DB_HOST,
  port: 28370,
  database: "defaultdb",
  dialect: "postgres",
  dialectModule: pg,
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
