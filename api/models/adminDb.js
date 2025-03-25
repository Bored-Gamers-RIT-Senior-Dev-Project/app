const db = require("../config/db");
const { createHttpError, HttpError } = require("http-errors");

const getRoleList = async () => {
    let sql = `SELECT * FROM roles`;

    const [rows] = await db.query(sql);

    return rows;
};

/**
 * One report should show college and team signup status. Columns would be Date Added,
    College Name, College Country, Number of Teams, Number of Team Members, College
    Moderator Account exists or not, College Page created or not.
 * @returns {Promise<Array<object>>}
 */
const getReportOne = async () => {
    const sql = `
    SELECT 
    u.CreatedAt AS DateAdded,
    u.UniversityName AS CollegeName,
    u.Location AS CollegeCountry,
    COUNT(DISTINCT t.TeamID) AS NumberOfTeams,
    COUNT(DISTINCT usr.UserID) AS NumberOfTeamMembers,
    CASE 
        WHEN EXISTS (
        SELECT 1 
        FROM users u2 
        INNER JOIN roles r ON u2.RoleID = r.RoleID 
        WHERE u2.UniversityID = u.UniversityID 
            AND r.RoleName = 'College Admin'
        ) THEN 'Yes'
        ELSE 'No'
    END AS CollegeModeratorExists,
    CASE 
        WHEN u.Description IS NOT NULL AND TRIM(u.Description) <> '' THEN 'Yes'
        ELSE 'No'
    END AS CollegePageCreated
    FROM universities u
    LEFT JOIN teams t ON t.UniversityID = u.UniversityID
    LEFT JOIN users usr ON usr.UniversityID = u.UniversityID
    GROUP BY 
    u.UniversityID, 
    u.CreatedAt, 
    u.UniversityName, 
    u.Location, 
    u.Description;
`;
    const [rows] = await db.query(sql);
    return rows;
};
/**
 * Totals for the count of colleges, number of teams, number of team members.
 * @returns {Promise<Array<object>>}
 */
const getReportOneTotals = async () => {
    const sql = `
    SELECT 
        COUNT(*) AS TotalColleges,
        SUM(NumberOfTeams) AS TotalTeams,
        SUM(NumberOfTeamMembers) AS TotalTeamMembers
        FROM (
        SELECT 
            u.UniversityID,
            COUNT(DISTINCT t.TeamID) AS NumberOfTeams,
            COUNT(DISTINCT usr.UserID) AS NumberOfTeamMembers
        FROM universities u
        LEFT JOIN teams t ON t.UniversityID = u.UniversityID
        LEFT JOIN users usr ON usr.UniversityID = u.UniversityID
        GROUP BY u.UniversityID
        ) sub;
    `;
    const [rows] = await db.query(sql);
    return rows[0];
};

module.exports = { getReportOne, getReportOneTotals, getRoleList };
