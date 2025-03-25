import React from "react";
import { Bracket } from "react-brackets";

/**
 * @typedef {import("react-brackets").RoundProps} RoundProps
 */

// Your original match data (the flat array)
const matches = [
    {
        id: 19874,
        name: "Final - Match",
        nextMatchId: null,
        nextLooserMatchId: null,
        tournamentRoundText: "6",
        startTime: "2021-05-30",
        state: "DONE",
        participants: [
            {
                id: "354506c4-d07d-4785-9759-755941a6cccc",
                resultText: null,
                isWinner: false,
                status: null,
                name: "TestTeam1234",
                picture: null,
            },
        ],
    },
    {
        id: 19875,
        name: "Semi Final - Match 1",
        nextMatchId: 19874,
        nextLooserMatchId: null,
        tournamentRoundText: "5",
        startTime: "2021-05-30",
        state: "SCHEDULED",
        participants: [
            {
                id: "e7fe8889-13e8-46f7-8515-3c9d89c07ba1",
                resultText: null,
                isWinner: false,
                status: null,
                name: "test87",
                picture: "teamlogos/client_team_default_logo",
            },
        ],
    },
    // ...more match objects
];

// Group the matches by tournamentRoundText
const groupMatchesByRound = (matchesArray) => {
    return matchesArray.reduce((acc, match) => {
        const round = match.tournamentRoundText;
        if (!acc[round]) {
            acc[round] = [];
        }
        acc[round].push(match);
        return acc;
    }, {});
};

const grouped = groupMatchesByRound(matches);

// Transform the grouped matches into the rounds structure expected by react-brackets
const rounds = Object.keys(grouped)
    .sort((a, b) => b - a) // sort descending so higher rounds come first
    .map((roundKey) => ({
        title: `Round ${roundKey}`,
        seeds: grouped[roundKey].map((match) => ({
            id: match.id,
            // Use the names of the participants as the teams.
            // Adjust this as needed if you require more info.
            teams: match.participants.map((p) => ({ name: p.name })),
            date: new Date(match.startTime),
        })),
    }));

const BracketTree = () => {
    return <Bracket rounds={rounds} />;
};

export { BracketTree };
