const fs = require("fs");

const DEPARTMENTS_FILE = "./src/server/departments.json";
const departments = JSON.parse(fs.readFileSync(DEPARTMENTS_FILE));

module.exports = function getDepartmentCode(department) {
  const dep = departments.find(({ slug }) => slug === department);
  return dep ? dep.code : null;
};
