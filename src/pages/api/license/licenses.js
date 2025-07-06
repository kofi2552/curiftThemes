import License from "@/lib/models/License";
import sequelize from "@/lib/db";

export default async function handler(req, res) {
  await sequelize.sync();
  const licenses = await License.findAll({ order: [["createdAt", "DESC"]] });
  res.status(200).json(licenses);
}
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "1mb", // Adjust as necessary
//     },
//   },
// };
