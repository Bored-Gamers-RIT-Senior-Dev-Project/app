const TournamentModel = require("../models/tournamentModel");

/* Helper Functions */

/**
 * Safely decodes a URI-encoded string.
 * @param {string|null|undefined} value - The URI-encoded string to decode.
 * @returns {string|null} The decoded string, or null if the input is null or undefined.
 */
const safeDecode = (value) => {
    return value !== null && value !== undefined
        ? decodeURIComponent(value)
        : null;
};

/**
 * Validates that a given value is an integer.
 * @param {number} value - The value to validate.
 * @param {string} fieldName - The name of the field (used in the error message).
 * @returns {number} The validated integer.
 * @throws {Error} Throws an error with status 400 if the value is not an integer.
 */
const validateInteger = (value, fieldName) => {
    value = Number(value);
    if (!Number.isInteger(value)) {
        const error = new Error(`Invalid ${fieldName}. Value must be integer.`);
        error.status = 400;
        throw error;
    }
    return value;
};

/* End Helper Functions */

/**
 * Creates a new tournament in the database with the status of "Upcoming".
 * @param {string} tournamentName - Name of the tournament.
 * @param {string} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string} endDate - End date of the tournament in YYYY-MM-DD format. If not provided, defaults to startDate.
 * @param {string} location - The location of the tournament.
 * @returns {Promise<object>} Returns the created tournament record.
 * @throws {Error} Throws an error with status 403 if the user is unauthorized.
 */
const createTournament = async (
    tournamentName,
    startDate,
    endDate = null,
    location
) => {
    try {
        // If no end date provided, default the end date to the start date.
        let finalEndDate = endDate === null ? startDate : endDate;
        const tournament = await TournamentModel.createTournament(
            tournamentName,
            startDate,
            finalEndDate,
            "Upcoming",
            location
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Searches tournaments in the database based on provided parameters.
 * @param {number|string|null} tournamentID - Tournament ID. If provided, search is based solely on this ID.
 * @param {string|null} tournamentName - Name of the tournament.
 * @param {string|null} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string|null} endDate - End date of the tournament in YYYY-MM-DD format.
 * @param {string|null} startsBefore - Returns tournaments starting on or before this date.
 * @param {string|null} startsAfter - Returns tournaments starting on or after this date.
 * @param {string|null} endsBefore - Returns tournaments ending on or before this date.
 * @param {string|null} endsAfter - Returns tournaments ending on or after this date.
 * @param {string|null} status - Tournament status.
 * @param {string|null} location - Tournament location.
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {string|boolean|null} sortAsDescending - If true, sorts results in descending order.
 * @returns {Promise<object|object[]|null>} Returns a tournament record or an array of tournaments.
 * @throws {Error} Throws an error if validation fails or the query fails.
 */
const searchTournaments = async (
    tournamentID = null,
    tournamentName = null,
    startDate = null,
    endDate = null,
    startsBefore = null,
    startsAfter = null,
    endsBefore = null,
    endsAfter = null,
    status = null,
    location = null,
    sortBy = null,
    sortAsDescending = false
) => {
    try {
        if (tournamentID !== null) {
            tournamentID = validateInteger(tournamentID, "tournamentID");
            const tournament = await TournamentModel.searchTournaments(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
            return tournament;
        } else {
            if (
                sortAsDescending === "true" ||
                sortAsDescending === "True" ||
                sortAsDescending === "TRUE"
            ) {
                sortAsDescending = true;
            }
            const tournament = await TournamentModel.searchTournaments(
                null,
                safeDecode(tournamentName),
                startDate,
                endDate,
                startsBefore,
                startsAfter,
                endsBefore,
                endsAfter,
                status,
                safeDecode(location),
                sortBy,
                sortAsDescending
            );
            return tournament;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Retrieves the tournament bracket including tournament details and match-ups.
 * @param {number} tournamentID - ID of the tournament.
 * @returns {Promise<object>} Returns an object containing tournament details and the bracket.
 * @throws {Error} Throws an error if the tournament or participants are not found.
 */
const getTournamentBracket = async (tournamentID) => {
    try {
        const bracket = [];
        const participants = await searchTournamentParticipants(tournamentID);
        const numTeams = participants.length;

        if (numTeams < 2) {
            bracket.push({
                title: "Round 1",
                seeds: [
                    {
                        MatchID: "TBD-PLACEHOLDER",
                        TournamentID: tournamentID,
                        MatchTime: null,
                        Team1ID: null,
                        Team1Name: "TBD",
                        Score1: null,
                        Team2ID: null,
                        Team2Name: "TBD",
                        WinnerID: null,
                        Score2: null,
                        BracketSide: "final",
                        BracketOrder: 0,
                        MatchRound: 1,
                    },
                ],
            });

            const tournament = await searchTournaments(tournamentID);
            return [tournament, bracket];
        }

        const rounds = Math.ceil(Math.log2(numTeams));
        let previousLeftCount = Math.ceil(numTeams / 2);
        let previousRightCount = Math.floor(numTeams / 2);

        let previousLeftWinners = [];
        let previousRightWinners = [];

        for (let i = 1; i <= rounds; i++) {
            const isFinalRound = i === rounds;

            let leftMatches = await searchMatches(
                null,
                tournamentID,
                "left",
                null,
                null,
                null,
                "BracketSide, sub.BracketOrder",
                null,
                i
            );

            let rightMatches = await searchMatches(
                null,
                tournamentID,
                "right",
                null,
                null,
                null,
                "BracketSide, sub.BracketOrder",
                null,
                i
            );

            let currentLeftCount = 0;
            let currentRightCount = 0;

            if (isFinalRound) {
                const totalPrev = previousLeftCount + previousRightCount;
                const tbdCount = totalPrev >= 2 ? 1 : 0;

                const finalMatch = Array.from({ length: tbdCount }).map(
                    (_, index) => ({
                        MatchID: `TBD-PLACEHOLDER`,
                        TournamentID: tournamentID,
                        MatchTime: null,
                        Team1ID: null,
                        Team1Name: "TBD",
                        Score1: null,
                        Team2ID: null,
                        Team2Name: "TBD",
                        WinnerID: null,
                        Score2: null,
                        BracketSide: "final",
                        BracketOrder: index,
                        MatchRound: i,
                    })
                );

                bracket.push({
                    title: `Round ${i}`,
                    seeds: finalMatch,
                });

                break;
            }

            if (!leftMatches || leftMatches.length === 0) {
                let tbdCount = 0;

                if (i === 1) {
                    tbdCount = Math.floor(numTeams / 4);
                } else if (previousLeftCount >= 2) {
                    tbdCount = Math.floor(previousLeftCount / 2);
                } else if (
                    previousLeftCount === 1 &&
                    previousRightCount > 1 &&
                    previousLeftWinners.length > 0
                ) {
                    const winner = previousLeftWinners[0];
                    leftMatches = [
                        {
                            MatchID: `BYE-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Team1Name:
                                winner.Team1Name ??
                                winner.Team2Name ??
                                "Winner",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "BYE",
                            WinnerID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Score2: null,
                            BracketSide: "left",
                            BracketOrder: 0,
                            MatchRound: i,
                        },
                    ];
                    currentLeftCount = 1;
                } else if (previousLeftCount === 1) {
                    tbdCount = 1;
                }

                if (!leftMatches || leftMatches.length === 0) {
                    leftMatches = Array.from({ length: tbdCount }).map(
                        (_, index) => ({
                            MatchID: `TBD-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: null,
                            Team1Name: "TBD",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "TBD",
                            WinnerID: null,
                            Score2: null,
                            BracketSide: "left",
                            BracketOrder: index,
                            MatchRound: i,
                        })
                    );
                    currentLeftCount = tbdCount;
                }
            } else {
                currentLeftCount = leftMatches.length;
            }

            if (!rightMatches || rightMatches.length === 0) {
                let tbdCount = 0;

                if (i === 1) {
                    tbdCount = Math.ceil(numTeams / 4);
                } else if (previousRightCount >= 2) {
                    tbdCount = Math.floor(previousRightCount / 2);
                } else if (
                    previousRightCount === 1 &&
                    previousLeftCount > 1 &&
                    previousRightWinners.length > 0
                ) {
                    const winner = previousRightWinners[0];
                    rightMatches = [
                        {
                            MatchID: `BYE-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Team1Name:
                                winner.Team1Name ??
                                winner.Team2Name ??
                                "Winner",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "BYE",
                            WinnerID: winner.Team1ID ?? winner.Team2ID ?? null,
                            Score2: null,
                            BracketSide: "right",
                            BracketOrder: 0,
                            MatchRound: i,
                        },
                    ];
                    currentRightCount = 1;
                } else if (previousRightCount === 1) {
                    tbdCount = 1;
                }

                if (!rightMatches || rightMatches.length === 0) {
                    rightMatches = Array.from({ length: tbdCount }).map(
                        (_, index) => ({
                            MatchID: `TBD-PLACEHOLDER`,
                            TournamentID: tournamentID,
                            MatchTime: null,
                            Team1ID: null,
                            Team1Name: "TBD",
                            Score1: null,
                            Team2ID: null,
                            Team2Name: "TBD",
                            Score2: null,
                            BracketSide: "right",
                            BracketOrder: index,
                            MatchRound: i,
                        })
                    );
                    currentRightCount = tbdCount;
                }
            } else {
                currentRightCount = rightMatches.length;
            }

            previousLeftCount = currentLeftCount;
            previousRightCount = currentRightCount;

            const isBye = (match) =>
                match.Team1ID !== null &&
                match.Team1ID === match.Team2ID &&
                match.WinnerID === match.Team1ID;

            previousLeftWinners = leftMatches.filter(
                (m) => m.WinnerID != null || isBye(m)
            );
            previousRightWinners = rightMatches.filter(
                (m) => m.WinnerID != null || isBye(m)
            );

            const formatByeMatches = (matches) => {
                return matches.map((match) => {
                    if (
                        match.Team1ID !== null &&
                        match.Team1ID === match.Team2ID &&
                        match.WinnerID === match.Team1ID
                    ) {
                        return {
                            ...match,
                            Team2ID: null,
                            Team2Name: "BYE",
                        };
                    }
                    return match;
                });
            };

            leftMatches = formatByeMatches(leftMatches);
            rightMatches = formatByeMatches(rightMatches);

            bracket.push({
                title: `Round ${i}`,
                seeds: [...leftMatches, ...rightMatches],
            });
        }

        const tournament = await searchTournaments(tournamentID);
        return [tournament, bracket];
    } catch (error) {
        console.error("Error generating tournament bracket:", error);
        throw error;
    }
};

/**
 * Updates the tournament details.
 * @param {number|string|null} tournamentID - ID of the tournament.
 * @param {string|null} tournamentName - New tournament name.
 * @param {string|null} startDate - New start date in YYYY-MM-DD format.
 * @param {string|null} endDate - New end date in YYYY-MM-DD format.
 * @param {string|null} status - New tournament status.
 * @param {string|null} location - New tournament location.
 * @returns {Promise<object|object[]|null>} Returns the updated tournament record.
 * @throws {Error} Throws an error if validation fails or the update fails.
 */
const updateTournamentDetails = async (
    tournamentID = null,
    tournamentName = null,
    startDate = null,
    endDate = null,
    status = null,
    location = null
) => {
    try {
        const tournamentIDnum = Number(tournamentID);
        validateInteger(tournamentIDnum, "tournamentID");
        await TournamentModel.updateTournamentDetails(
            tournamentID,
            tournamentName,
            startDate,
            endDate,
            status,
            location
        );
        const tournament = searchTournaments(tournamentID);
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a tournament.
 * @param {number|string|null} tournamentID - ID of the tournament to delete.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if tournament deletion fails.
 */
const deleteTournament = async (tournamentID = null) => {
    try {
        const tournamentIDnum = Number(tournamentID);
        validateInteger(tournamentIDnum, "tournamentID");
        await TournamentModel.deleteTournament(tournamentID);
    } catch (error) {
        throw error;
    }
};

/**
 * Adds a participant to a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the team is already registered or the addition fails.
 */
const addTournamentParticipant = async (tournamentID, teamID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        teamID = validateInteger(teamID, "teamID");
        const existingParticipant =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                teamID
            );
        if (existingParticipant && existingParticipant.length > 0) {
            throw new Error("Team is already registered for this tournament.");
        }
        await TournamentModel.addTournamentParticipant(tournamentID, teamID);
    } catch (error) {
        throw error;
    }
};

/**
 * Removes a participant from a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the participant is not found or removal fails.
 */
const removeTournamentParticipant = async (tournamentID, teamID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        teamID = validateInteger(teamID, "teamID");
        const existingParticipant =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                teamID
            );
        if (!existingParticipant || existingParticipant.length === 0) {
            throw new Error("Team not found in this tournament.");
        }
        await TournamentModel.removeTournamentParticipant(tournamentID, teamID);
    } catch (error) {
        throw error;
    }
};

/**
 * Searches for tournament participants based on provided criteria.
 * @param {number|null} tournamentID - ID of the tournament.
 * @param {number|null} teamID - ID of the team.
 * @param {string|null} teamName - Name of the team.
 * @param {number|null} teamLeaderID - ID of the team leader.
 * @param {string|null} teamLeaderName - Name of the team leader.
 * @param {number|null} round - Round number.
 * @param {number|null} byes - Number of byes.
 * @param {string|null} status - Participant status.
 * @param {string|null} bracketSide - Bracket side ("left" or "right").
 * @param {number|null} nextMatchID - ID of the next match.
 * @param {number|null} universityID - ID of the university.
 * @param {string|null} universityName - Name of the university.
 * @param {boolean|null} isApproved - Approval status.
 * @param {string|null} sortBy - Field to sort by.
 * @param {boolean} sortAsDescending - If true, sorts in descending order.
 * @returns {Promise<object[]|null>} Returns an array of participant records or null.
 * @throws {Error} Throws an error if the search fails.
 */
const searchTournamentParticipants = async (
    tournamentID,
    teamID,
    teamName,
    teamLeaderID,
    teamLeaderName,
    round,
    byes,
    status,
    bracketSide,
    nextMatchID,
    universityID,
    universityName,
    isApproved,
    sortBy,
    sortAsDescending
) => {
    try {
        const tournament = await TournamentModel.searchTournamentParticipants(
            tournamentID,
            teamID,
            teamName,
            teamLeaderID,
            teamLeaderName,
            round,
            byes,
            status,
            bracketSide,
            nextMatchID,
            universityID,
            universityName,
            isApproved,
            sortBy,
            sortAsDescending
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Updates a tournament participant's details.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} teamID - ID of the team.
 * @param {number} round - New round number.
 * @param {number} byes - New bye count.
 * @param {string} status - New participant status.
 * @param {string} bracketSide - New bracket side ("left" or "right").
 * @param {number|null} nextMatchID - ID of the next match or null.
 * @param {number} bracketOrder - New order in the bracket.
 * @returns {Promise<object>} Returns the updated participant record.
 * @throws {Error} Throws an error if the update fails.
 */
const updateTournamentParticipant = async (
    tournamentID,
    teamID,
    round,
    byes,
    status,
    bracketSide,
    nextMatchID,
    bracketOrder
) => {
    try {
        const participant = await TournamentModel.updateTournamentParticipant(
            tournamentID,
            teamID,
            round,
            byes,
            status,
            bracketSide,
            nextMatchID,
            bracketOrder
        );
        return participant;
    } catch (error) {
        throw error;
    }
};

/**
 * Adds a facilitator to a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} userID - ID of the facilitator.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the facilitator already exists or if the operation fails.
 */
const addTournamentFacilitator = async (tournamentID, userID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        userID = validateInteger(userID, "userID");
        const existingFacilitator =
            await TournamentModel.searchTournamentFacilitators(
                tournamentID,
                userID
            );
        if (existingFacilitator && existingFacilitator.length > 0) {
            throw new Error("Facilitator already exists for this tournament.");
        }
        await TournamentModel.addTournamentFacilitator(tournamentID, userID);
    } catch (error) {
        throw error;
    }
};

/**
 * Removes a facilitator from a tournament.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {number|string} userID - ID of the facilitator.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the facilitator is not found or if the removal fails.
 */
const removeTournamentFacilitator = async (tournamentID, userID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        userID = validateInteger(userID, "userID");
        const existingFacilitator =
            await TournamentModel.searchTournamentFacilitators(
                tournamentID,
                userID
            );
        if (!existingFacilitator || existingFacilitator.length === 0) {
            throw new Error("Facilitator not found in this tournament.");
        }
        await TournamentModel.removeTournamentFacilitator(tournamentID, userID);
    } catch (error) {
        throw error;
    }
};

/**
 * Searches for tournament facilitators based on provided criteria.
 * @param {number|null} tournamentID - ID of the tournament.
 * @param {number|null} userID - ID of the facilitator.
 * @param {string|null} name - Facilitator's name.
 * @param {string|null} email - Facilitator's email.
 * @param {number|null} universityID - University ID.
 * @returns {Promise<object[]|null>} Returns an array of facilitator records or null.
 * @throws {Error} Throws an error if the search fails.
 */
const searchTournamentFacilitators = async (
    tournamentID,
    userID,
    name,
    email,
    universityID
) => {
    try {
        const tournament = await TournamentModel.searchTournamentFacilitators(
            tournamentID,
            userID,
            name,
            email,
            universityID
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Starts a tournament by shuffling participants, assigning bracket sides,
 * and scheduling the first round of matches.
 * @param {number|string} tournamentID - ID of the tournament.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the user is unauthorized or if the tournament cannot be started.
 */
const startTournament = async (tournamentID) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        const shuffleParticipants =
            await TournamentModel.searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                "active",
                null,
                null,
                null,
                null,
                null,
                "RAND()"
            );
        const numParticipants = shuffleParticipants.length;
        let leftSide, rightSide;
        if (numParticipants % 4 == 0) {
            leftSide = shuffleParticipants.slice(0, numParticipants / 2);
            rightSide = shuffleParticipants.slice(numParticipants / 2);
        } else if (numParticipants % 4 == 1) {
            leftSide = shuffleParticipants.slice(
                0,
                Math.ceil(numParticipants / 2)
            );
            rightSide = shuffleParticipants.slice(
                Math.ceil(numParticipants / 2)
            );
        } else if (numParticipants % 4 == 2) {
            leftSide = shuffleParticipants.slice(0, numParticipants / 2 + 1);
            rightSide = shuffleParticipants.slice(numParticipants / 2 + 1);
        } else {
            leftSide = shuffleParticipants.slice(
                0,
                Math.ceil(numParticipants / 2) + 1
            );
            rightSide = shuffleParticipants.slice(
                Math.floor(numParticipants / 2)
            );
        }
        if (rightSide.length + leftSide.length != numParticipants) {
            throw new Error("Mathing error.");
        }

        let bracketOrder = 1;
        for (const item of leftSide) {
            await updateTournamentParticipant(
                tournamentID,
                item.TeamID,
                1,
                0,
                "active",
                "left",
                null,
                bracketOrder
            );
            bracketOrder++;
        }

        bracketOrder = 1;
        for (const item of rightSide) {
            await updateTournamentParticipant(
                tournamentID,
                item.TeamID,
                1,
                0,
                "active",
                "right",
                null,
                bracketOrder
            );
            bracketOrder++;
        }
        await nextRound(tournamentID, "left", 1);
        await nextRound(tournamentID, "right", 1);
    } catch (error) {
        throw error;
    }
};

/**
 * Schedules the next round of matches for a given bracket side.
 * @param {number|string} tournamentID - ID of the tournament.
 * @param {string} bracketSide - Bracket side ("left" or "right").
 * @param {number} round - The current round number.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if match scheduling fails.
 */
const nextRound = async (tournamentID, bracketSide, round) => {
    try {
        const totalParticipants =
            await TournamentModel.searchTournamentParticipants(tournamentID);
        const totalRounds = Math.ceil(Math.log2(totalParticipants.length));
        const participants = await searchTournamentParticipants(
            tournamentID,
            null,
            null,
            null,
            null,
            round,
            null,
            "active",
            bracketSide
        );

        let numParticipants = participants.length;
        if (round === totalRounds) {
            let otherBracketSide;
            if (bracketSide === "left") {
                otherBracketSide = "right";
            } else {
                otherBracketSide = "left";
            }

            const otherSideParticipants = await searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                null,
                null,
                "active",
                otherBracketSide
            );

            if (otherSideParticipants.length === 1) {
                const now = new Date();
                createMatch(
                    tournamentID,
                    participants[0].TeamID,
                    otherSideParticipants[0].TeamID,
                    Date(now.getTime() + 15 * 60 * 1000)
                );
            }
        } else if (numParticipants === 1) {
            const team = participants[0];
            await updateTournamentParticipant(
                tournamentID,
                team.TeamID,
                team.Round + 1,
                team.Byes + 1,
                "active",
                null,
                null,
                0
            );
            await nextRound(tournamentID, bracketSide, round + 1);
        } else if (numParticipants % 2 === 0) {
            for (let i = 0; i < numParticipants; i += 2) {
                const team1 = participants[i];
                const team2 = participants[i + 1];
                const now = new Date();
                await createMatch(
                    tournamentID,
                    team1.TeamID,
                    team2.TeamID,
                    Date(now.getTime() + 15 * 60 * 1000)
                );
            }
        } else {
            const byeTeam = (
                await searchTournamentParticipants(
                    tournamentID,
                    null,
                    null,
                    null,
                    null,
                    round,
                    null,
                    "active",
                    bracketSide,
                    null,
                    null,
                    null,
                    null,
                    "Byes, TeamCreatedAt"
                )
            )[0];

            await updateTournamentParticipant(
                tournamentID,
                byeTeam.TeamID,
                byeTeam.TeamRound + 1,
                byeTeam.TeamByeCount + 1
            );

            const updatedParticipants = await searchTournamentParticipants(
                tournamentID,
                null,
                null,
                null,
                null,
                round,
                null,
                "active",
                bracketSide,
                null,
                null,
                null,
                null,
                "BracketOrder"
            );
            numParticipants = updatedParticipants.length;
            if (numParticipants % 2 === 0) {
                for (let i = 0; i < numParticipants; i += 2) {
                    const team1 = updatedParticipants[i];
                    const team2 = updatedParticipants[i + 1];
                    const now = new Date();
                    await createMatch(
                        tournamentID,
                        team1.TeamID,
                        team2.TeamID,
                        Date(now.getTime() + 15 * 60 * 1000)
                    );
                }
            } else {
                throw new Error("Mathing error when generating next round.");
            }
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Creates a match for the tournament in the database.
 * @param {number|string} tournamentID - The tournament ID.
 * @param {number|string} team1ID - Team 1 ID.
 * @param {number|string} team2ID - Team 2 ID.
 * @param {string} matchTime - The match time as an ISO 8601 string (e.g., "2025-02-17T00:00:00Z").
 * @returns {Promise<object>} Returns the created match record.
 * @throws {Error} Throws an error if the match cannot be created.
 */
const createMatch = async (tournamentID, team1ID, team2ID, matchTime) => {
    try {
        tournamentID = validateInteger(tournamentID, "tournamentID");
        team1ID = validateInteger(team1ID, "team1ID");
        team2ID = validateInteger(team2ID, "team2ID");
        const formattedMatchTime = new Date(matchTime)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const match = await TournamentModel.createMatch(
            tournamentID,
            team1ID,
            team2ID,
            formattedMatchTime
        );
        return match;
    } catch (error) {
        throw error;
    }
};

/**
 * Searches for tournament matches based on provided criteria.
 * If matchID is specified, the search is performed solely based on matchID.
 * @param {number|string|null} matchID - ID for the match.
 * @param {number|string|null} tournamentID - ID for the tournament.
 * @param {string|null} bracketSide - Bracket side filter.
 * @param {number|string|null} teamID - ID for a team.
 * @param {string|null} before - Latest datetime (inclusive) for matches ("YYYY-MM-DD HH:mm:ss").
 * @param {string|null} after - Earliest datetime (inclusive) for matches ("YYYY-MM-DD HH:mm:ss").
 * @param {string|null} sortBy - Field to sort by.
 * @param {string|boolean|null} sortAsDescending - If true, sorts in descending order.
 * @param {number|string|null} winnerID - Winner ID filter.
 * @returns {Promise<object|object[]|null>} Returns a match record if matchID is provided, an array of matches if searching by criteria, or null if not found.
 * @throws {Error} Throws an error if validation fails or the search query fails.
 */
const searchMatches = async (
    matchID,
    tournamentID,
    bracketSide,
    teamID,
    before,
    after,
    sortBy,
    sortAsDescending,
    winnerID
) => {
    try {
        if (matchID) {
            matchID = validateInteger(matchID, "matchID");
            const match = await TournamentModel.searchMatches(matchID);
            return match;
        } else {
            if (
                sortAsDescending === "true" ||
                sortAsDescending === "True" ||
                sortAsDescending === "TRUE"
            ) {
                sortAsDescending = true;
            }
            const match = await TournamentModel.searchMatches(
                null,
                tournamentID,
                bracketSide,
                teamID,
                before,
                after,
                sortBy,
                sortAsDescending,
                winnerID
            );
            return match;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Updates the match result in the database based on matchID.
 * @param {number|string} matchID - ID of the match to update.
 * @param {number|string} winnerID - ID for the winning team.
 * @param {number|string} score1 - Score for team one.
 * @param {number|string} score2 - Score for team two.
 * @returns {Promise<object>} Returns the updated match result.
 * @throws {Error} Throws an error if any parameter validation fails or the update fails.
 */
const updateMatchResult = async (matchID, score1, score2) => {
    try {
        matchID = validateInteger(matchID, "matchID");
        score1 = validateInteger(score1, "score1");
        score2 = validateInteger(score2, "score2");

        if (score1 === score2) {
            console.error("Score1 and Score2 are equal. No ties allowed.");
            throw new Error("There are no ties! Please choose a winner.");
        }

        const match = await searchMatches(matchID);

        if (!match) throw new Error("Could not find match");

        const participants = await searchTournamentParticipants(
            match.TournamentID,
            match.Team1ID
        );

        if (!participants || participants.length === 0)
            throw new Error("Could not retrieve participant info for Team1.");

        const currentRound = participants[0].TeamRound;
        const bracketSide = participants[0].TeamBracketSide;

        if (score1 > score2) {
            await TournamentModel.updateMatchResult(
                match.MatchID,
                match.Team1ID,
                score1,
                score2
            );
            await updateTournamentParticipant(
                match.TournamentID,
                match.Team1ID,
                currentRound + 1
            );

            await updateTournamentParticipant(
                match.TournamentID,
                match.Team2ID,
                null,
                null,
                "lost",
                null,
                -1,
                null
            );
        } else {
            await TournamentModel.updateMatchResult(
                match.MatchID,
                match.Team2ID,
                score1,
                score2
            );
            await updateTournamentParticipant(
                match.TournamentID,
                match.Team2ID,
                currentRound + 1
            );
            await updateTournamentParticipant(
                match.TournamentID,
                match.Team1ID,
                null,
                null,
                "lost",
                null,
                -1,
                null
            );
        }

        const remainingActive = await searchTournamentParticipants(
            match.TournamentID,
            null,
            null,
            null,
            null,
            currentRound,
            null,
            "active",
            bracketSide
        );

        if (!remainingActive || remainingActive.length === 0) {
            await nextRound(match.TournamentID, bracketSide, currentRound + 1);
        }

        return await searchMatches(matchID);
    } catch (error) {
        console.error("Error in updateMatchResult:", error);
        throw error;
    }
};

module.exports = {
    createTournament,
    searchTournaments,
    updateTournamentDetails,
    deleteTournament,
    getTournamentBracket,
    addTournamentParticipant,
    removeTournamentParticipant,
    searchTournamentParticipants,
    updateTournamentParticipant,
    addTournamentFacilitator,
    removeTournamentFacilitator,
    searchTournamentFacilitators,
    startTournament,
    createMatch,
    searchMatches,
    updateMatchResult,
};
