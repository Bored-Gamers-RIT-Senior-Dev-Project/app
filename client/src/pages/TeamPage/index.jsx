import { useState } from "react";
import { useLoaderData } from "react-router";
import { TeamEditor } from "./TeamEditor";
import { TeamView } from "./TeamView";

const TeamPage = () => {
    const team = useLoaderData();
    const [editMode, setEditMode] = useState(false);
    const [teamName, setTeamName] = useState(team.teamName);
    const [teamSummary, setTeamSummary] = useState(team.description ?? "");
    const [members, setMembers] = useState([
        {
            id: 1,
            name: "User Name",
            role: "Member",
            blurb: "Lorem ipsum dolor asdf this is a user blurb.",
        },
        {
            id: 2,
            name: "User Name",
            role: "Scientist",
            blurb: "Fourth-year student studying engineering. Member of the e-sports team.",
        },
        {
            id: 3,
            name: "User Name",
            role: "Writer",
            blurb: "Third-year student double-majoring Creative Writing and Theater.",
        },
    ]);

    const [tab, setTab] = useState(0);

    return editMode ? (
        <TeamEditor
            teamName={teamName}
            setTeamName={setTeamName}
            teamSummary={teamSummary}
            setTeamSummary={setTeamSummary}
            members={members}
            setMembers={setMembers}
            tab={tab}
            setTab={setTab}
            exitEditMode={() => setEditMode(false)}
        />
    ) : (
        <TeamView
            teamName={teamName}
            teamSummary={teamSummary}
            members={members}
            tab={tab}
            setTab={setTab}
            enterEditMode={() => setEditMode(true)}
        />
    );
};

export { TeamPage };
