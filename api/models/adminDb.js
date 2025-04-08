const db = require("../config/db");
const createHttpError = require("http-errors");

const getRoleList = async () => {
    const sql = `SELECT * FROM roles`;

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

const getReportTwo = async () => {
    const sql = `SELECT 
  COALESCE(
    (
      SELECT DATE_FORMAT(MIN(m.MatchTime), '%Y-%m-%d %H:%i:%s')
      FROM teams t2
      INNER JOIN tournament_participants tp2 ON t2.TeamID = tp2.TeamID
      INNER JOIN matches m ON tp2.NextMatchID = m.MatchID
      WHERE t2.UniversityID = u.UniversityID
        AND m.MatchTime >= NOW()
    ),
    'No upcoming tournament play'
  ) AS DateOfNextTournamentPlay,
  u.UniversityName AS CollegeName,
  u.Location AS CollegeCountry,
  (
    SELECT COUNT(DISTINCT m.MatchID)
    FROM teams t2
    INNER JOIN tournament_participants tp2 ON t2.TeamID = tp2.TeamID
    INNER JOIN matches m ON tp2.NextMatchID = m.MatchID
    WHERE t2.UniversityID = u.UniversityID 
      AND m.MatchTime >= NOW()
      AND tp2.Round = (
            SELECT MIN(tp3.Round)
            FROM teams t3
            INNER JOIN tournament_participants tp3 ON t3.TeamID = tp3.TeamID
            INNER JOIN matches m2 ON tp3.NextMatchID = m2.MatchID
            WHERE t3.UniversityID = u.UniversityID 
              AND m2.MatchTime >= NOW()
          )
  ) AS NumberOfMatchesPlanned,
  (
    SELECT COUNT(DISTINCT m2.MatchID)
    FROM teams t2
    INNER JOIN matches m2 ON (t2.TeamID = m2.Team1ID OR t2.TeamID = m2.Team2ID)
    WHERE t2.UniversityID = u.UniversityID
      AND m2.WinnerID IS NOT NULL
  ) AS TotalMatchesPlayed,
  CASE 
    WHEN (
      SELECT COUNT(*)
      FROM teams t2
      INNER JOIN tournament_participants tp2 ON t2.TeamID = tp2.TeamID
      WHERE t2.UniversityID = u.UniversityID
        AND tp2.Status = 'active'
    ) > 0 THEN 'No'
    ELSE 'Yes'
  END AS EliminationsComplete
FROM universities u
WHERE EXISTS (
  SELECT 1
  FROM teams t
  INNER JOIN tournament_participants tp ON t.TeamID = tp.TeamID
  WHERE t.UniversityID = u.UniversityID
)
ORDER BY DateOfNextTournamentPlay;`;
    const [data] = await db.query(sql);
    return data;
};

const getReportTwoTotals = async () => {
    const sql = `SELECT 
  COUNT(*) AS TotalColleges,
  SUM(NumberOfMatchesPlanned) AS TotalMatchesPlanned,
  SUM(TotalMatchesPlayed) AS TotalMatchesPlayed
FROM (
  SELECT 
    u.UniversityID,
    (
      SELECT COUNT(DISTINCT m.MatchID)
      FROM teams t2
      INNER JOIN tournament_participants tp2 ON t2.TeamID = tp2.TeamID
      INNER JOIN matches m ON tp2.NextMatchID = m.MatchID
      WHERE t2.UniversityID = u.UniversityID 
        AND m.MatchTime >= NOW()
        AND tp2.Round = (
              SELECT MIN(tp3.Round)
              FROM teams t3
              INNER JOIN tournament_participants tp3 ON t3.TeamID = tp3.TeamID
              INNER JOIN matches m2 ON tp3.NextMatchID = m2.MatchID
              WHERE t3.UniversityID = u.UniversityID 
                AND m2.MatchTime >= NOW()
          )
    ) AS NumberOfMatchesPlanned,
    (
      SELECT COUNT(DISTINCT m2.MatchID)
      FROM teams t2
      INNER JOIN matches m2 
        ON (t2.TeamID = m2.Team1ID OR t2.TeamID = m2.Team2ID)
      WHERE t2.UniversityID = u.UniversityID 
        AND m2.WinnerID IS NOT NULL
    ) AS TotalMatchesPlayed
  FROM universities u
  WHERE EXISTS (
    SELECT 1
    FROM teams t
    INNER JOIN tournament_participants tp ON t.TeamID = tp.TeamID
    WHERE t.UniversityID = u.UniversityID
  )
) AS college_tournament_status;`;
    const [data] = await db.query(sql);
    return data[0];
};

/**
 * Gets a list of events the University Admin needs to review, then returns them as a list.
 * @param {number} universityId University Admin's University ID
 * @returns {List<object>} An array of all events that need to be evaluated.
 */
const getUniversityAdminTickets = async (universityId) => {
    const newTeamsQuery = `SELECT *, "newTeam" type FROM teams WHERE IsApproved = false AND UniversityID = ?`;

    const newUsersQuery = `SELECT *, "newUser" type FROM users WHERE IsValidated = false AND UniversityID = ?`;

    const teamEditsQuery = `SELECT upd.*,
            t.TeamName CurrentTeamName,
            "teamEdit" type
        FROM team_update upd
        JOIN teams t ON upd.UpdatedTeamID = t.TeamId
        WHERE t.UniversityId = ?
        AND ApprovedBy IS NULL`;

    const userEditsQuery = ` SELECT upd.*,
            u.Email CurrentEmail,
            u.Username CurrentUsername,
            u.FirstName CurrentFirstName,
            u.LastName CurrentLastName,
            "userEdit" type
        FROM user_update upd
        JOIN users u ON upd.UpdatedUserID = u.UserID
        WHERE u.UniversityId = ?
        AND ApprovedBy IS NULL`;

    const [newTeams, newUsers, teamEdits, userEdits] = await Promise.all(
        [newTeamsQuery, newUsersQuery, teamEditsQuery, userEditsQuery].map(
            (q) => db.query(q, [universityId]).then(([rows]) => rows)
        )
    );

    const result = [...teamEdits, ...userEdits, ...newUsers, ...newTeams];

    //Sort generated using copilot
    result.sort((a, b) => {
        const dateA = a.CreatedAt ?? a.RequestedDate;
        const dateB = b.CreatedAt ?? b.RequestedDate;

        return new Date(dateA) - new Date(dateB);
    });

    return result;
};

module.exports = {
    getReportOne,
    getReportOneTotals,
    getReportTwo,
    getReportTwoTotals,
    getRoleList,
    getUniversityAdminTickets,
};
