const db = require("../config/db");

const getTournamentsWithMatches = async () => {
  const [tournaments] = await db.query(`
    SELECT 
      TournamentID AS tournamentId,
      TournamentName AS tournamentName,
      DATE_FORMAT(StartDate, '%Y-%m-%d') AS startDate,
      DATE_FORMAT(EndDate, '%Y-%m-%d') AS endDate,
      Status AS status,
      Location AS location
    FROM tournaments
    ORDER BY StartDate ASC;
  `);

  const tournamentIds = tournaments.map(t => t.tournamentId);
  const [matches] = await db.query(`
    SELECT 
      m.MatchID AS matchId,
      m.TournamentID AS tournamentId,
      m.Team1ID AS team1Id,
      m.Team2ID AS team2Id,
      m.Score1 AS score1,
      m.Score2 AS score2,
      m.WinnerID AS winnerId,
      DATE_FORMAT(m.MatchTime, '%Y-%m-%d %H:%i:%s') AS matchTime,
      m.Location AS location,
      t1.TeamName AS team1Name,
      t2.TeamName AS team2Name
    FROM matches m
    JOIN teams t1 ON m.Team1ID = t1.TeamID
    JOIN teams t2 ON m.Team2ID = t2.TeamID
    WHERE m.TournamentID IN (?)
  `, [tournamentIds]);

  const matchMap = {};
  matches.forEach(match => {
    if (!matchMap[match.tournamentId]) matchMap[match.tournamentId] = [];
    matchMap[match.tournamentId].push(match);
  });

  const combined = tournaments.map(t => ({
    ...t,
    matches: matchMap[t.tournamentId] || []
  }));

  return combined;
};

module.exports = { getTournamentsWithMatches };
