const db = require("../config/db");
const { createHttpError, HttpError } = require("http-errors");

const getRoleList = async () => {
    let sql = `SELECT * FROM roles`;

    const [rows] = await db.query(sql);

    return rows;
};

module.exports = { getRoleList };
