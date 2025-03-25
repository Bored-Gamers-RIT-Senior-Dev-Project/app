import { Box, Typography } from "@mui/material";
import React from "react";
import {
    Bracket,
    Seed,
    SeedItem,
    SeedTeam,
    SeedTime,
    SingleLineSeed,
} from "react-brackets";

const rounds = [
    {
        title: "Round 1",
        seeds: [
            {
                id: 1,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 1,
                        name: "The Lingos",
                        college: "UCD Dublin",
                        picture:
                            "https://brandlogos.net/wp-content/uploads/2023/09/duolingo_icon-logo_brandlogos.net_aru6q-512x512.png",
                    },
                    {
                        id: 2,
                        name: "Georgeous",
                        college: "Cornell University",
                        picture:
                            "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Cornell_Big_Red_logo.svg/800px-Cornell_Big_Red_logo.svg.png",
                    },
                ],
            },
            {
                id: 2,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 3,
                        name: "Crimson Knights",
                        college: "Harvard University",
                        picture:
                            "https://cdn.vectorstock.com/i/500p/33/29/knight-templar-mascot-vector-30093329.jpg",
                    },
                    {
                        id: 4,
                        name: "Bulldogs",
                        college: "Yale University",
                        picture:
                            "https://geniusvets.s3.amazonaws.com/gv-dog-breeds/american-bulldog-1.jpg",
                    },
                ],
            },
            {
                id: 3,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 5,
                        name: "Naruto Nerds",
                        college: "RIT",
                        picture:
                            "https://www.rit.edu/brandportal/sites/rit.edu.brandportal/files/inline-images/Roaring%20Tiger%201505c-100.jpg",
                    },
                    {
                        id: 6,
                        name: "Cardinal Flyers",
                        college: "Stanford University",
                        picture:
                            "https://media.istockphoto.com/id/1482047378/vector/cardinal-mascot-for-logo-sport-and-esport.jpg?s=612x612&w=0&k=20&c=dm2unsbO5G06LAv3ufWZPoFN1Z-tvF3nSMOiada4V7g=",
                    },
                ],
            },
            {
                id: 4,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 7,
                        name: "Tech Titans",
                        college: "MIT",
                        picture:
                            "https://www.jammable.com/cdn-cgi/image/width=3840,quality=25,format=webp/https://imagecdn.voicify.ai/models/331f1689-afdf-434d-9ca7-e058b55baa9d.png",
                    },
                    {
                        id: 8,
                        name: "Beaver Battalion",
                        college: "Caltech",
                        picture:
                            "https://imgcdn.stablediffusionweb.com/2024/5/17/7908d835-7af2-48db-8c0e-ab5c0b74a89d.jpg",
                    },
                ],
            },
            {
                id: 5,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 9,
                        name: "Oxonians",
                        college: "University of Oxford",
                        picture:
                            "https://cdn-icons-png.flaticon.com/512/7627/7627796.png",
                    },
                    {
                        id: 10,
                        name: "Cambridge Blues",
                        college: "University of Cambridge",
                        picture:
                            "https://i.etsystatic.com/39063241/r/il/da2a07/5732766978/il_570xN.5732766978_82sq.jpg",
                    },
                ],
            },
            {
                id: 6,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 11,
                        name: "Imperials",
                        college: "Imperial College London",
                        picture:
                            "https://i.pinimg.com/736x/3f/c0/d3/3fc0d3678953a0f95f2b624bcf7ee6d2.jpg",
                    },
                    {
                        id: 12,
                        name: "Varsity Blues",
                        college: "University of Toronto",
                        picture:
                            "https://static.vecteezy.com/system/resources/previews/003/817/301/non_2x/ice-hockey-design-on-white-background-hockey-stick-line-art-logos-or-icons-illustration-vector.jpg",
                    },
                ],
            },
            {
                id: 7,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 13,
                        name: "Mavericks",
                        college: "University of Melbourne",
                        picture:
                            "https://static.vecteezy.com/system/resources/previews/025/227/074/non_2x/kangaroo-icon-design-vector.jpg",
                    },
                    {
                        id: 14,
                        name: "Sharks",
                        college: "University of Sydney",
                        picture:
                            "https://cdn-icons-png.flaticon.com/512/4973/4973667.png",
                    },
                ],
            },
            {
                id: 8,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 13,
                        name: "Mavericks",
                        college: "University of Melbourne",
                        picture:
                            "https://static.vecteezy.com/system/resources/previews/025/227/074/non_2x/kangaroo-icon-design-vector.jpg",
                    },
                    {
                        id: 16,
                        name: "Singapore Lions",
                        college: "National University of Singapore",
                        picture:
                            "https://static.wikia.nocookie.net/disney/images/3/37/Profile_-_Simba.jpeg",
                    },
                ],
            },
        ],
    },
    {
        title: "Round 2",
        seeds: [
            {
                id: 9,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 2,
                        name: "Georgeous",
                        college: "Cornell University",
                        picture:
                            "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Cornell_Big_Red_logo.svg/800px-Cornell_Big_Red_logo.svg.png",
                    },
                    {
                        id: 3,
                        name: "Crimson Knights",
                        college: "Harvard University",
                        picture:
                            "https://cdn.vectorstock.com/i/500p/33/29/knight-templar-mascot-vector-30093329.jpg",
                    },
                ],
            },
            {
                id: 10,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 6,
                        name: "Naruto Nerds",
                        college: "RIT",
                        picture:
                            "https://www.rit.edu/brandportal/sites/rit.edu.brandportal/files/inline-images/Roaring%20Tiger%201505c-100.jpg",
                    },
                    {
                        id: 7,
                        name: "Tech Titans",
                        college: "MIT",
                        picture:
                            "https://www.jammable.com/cdn-cgi/image/width=3840,quality=25,format=webp/https://imagecdn.voicify.ai/models/331f1689-afdf-434d-9ca7-e058b55baa9d.png",
                    },
                ],
            },
            {
                id: 11,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 9,
                        name: "Oxonians",
                        college: "University of Oxford",
                        picture:
                            "https://cdn-icons-png.flaticon.com/512/7627/7627796.png",
                    },
                    {
                        id: 12,
                        name: "Varsity Blues",
                        college: "University of Toronto",
                        picture:
                            "https://static.vecteezy.com/system/resources/previews/003/817/301/non_2x/ice-hockey-design-on-white-background-hockey-stick-line-art-logos-or-icons-illustration-vector.jpg",
                    },
                ],
            },
            {
                id: 12,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 13,
                        name: "Mavericks",
                        college: "University of Melbourne",
                        picture:
                            "https://static.vecteezy.com/system/resources/previews/025/227/074/non_2x/kangaroo-icon-design-vector.jpg",
                    },
                    {
                        id: 16,
                        name: "Singapore Lions",
                        college: "National University of Singapore",
                        picture:
                            "https://static.wikia.nocookie.net/disney/images/3/37/Profile_-_Simba.jpeg",
                    },
                ],
            },
        ],
    },
    {
        title: "Semi Finals",
        seeds: [
            {
                id: 13,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 2,
                        name: "Georgeous",
                        college: "Cornell University",
                        picture:
                            "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Cornell_Big_Red_logo.svg/800px-Cornell_Big_Red_logo.svg.png",
                    },
                    {
                        id: 7,
                        name: "Tech Titans",
                        college: "MIT",
                        picture:
                            "https://www.jammable.com/cdn-cgi/image/width=3840,quality=25,format=webp/https://imagecdn.voicify.ai/models/331f1689-afdf-434d-9ca7-e058b55baa9d.png",
                    },
                ],
            },
            {
                id: 14,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 9,
                        name: "Oxonians",
                        college: "University of Oxford",
                        picture:
                            "https://cdn-icons-png.flaticon.com/512/7627/7627796.png",
                    },
                    {
                        id: 16,
                        name: "Singapore Lions",
                        college: "National University of Singapore",
                        picture:
                            "https://static.wikia.nocookie.net/disney/images/3/37/Profile_-_Simba.jpeg",
                    },
                ],
            },
        ],
    },
    {
        title: "Finals",
        seeds: [
            {
                id: 15,
                date: new Date().toDateString(),
                teams: [
                    {
                        id: 2,
                        name: "Georgeous",
                        college: "Cornell University",
                        picture:
                            "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Cornell_Big_Red_logo.svg/800px-Cornell_Big_Red_logo.svg.png",
                    },
                    {
                        id: 9,
                        name: "Oxonians",
                        college: "University of Oxford",
                        picture:
                            "https://cdn-icons-png.flaticon.com/512/7627/7627796.png",
                    },
                ],
            },
        ],
    },
];

const RenderSeed = ({ breakpoint, seed, isMiddleOfTwoSided }) => {
    const Wrapper = isMiddleOfTwoSided ? SingleLineSeed : Seed;

    const renderTeam = (team) => (
        <SeedTeam style={{ display: "flex", alignItems: "center" }}>
            {team.picture && (
                <img
                    src={team.picture}
                    alt={team.name}
                    style={{
                        width: 30,
                        height: 30,
                        marginRight: 8,
                    }}
                />
            )}
            <div style={{ flexGrow: 1, textAlign: "right" }}>
                <div>{team.name || "-----------"}</div>
                <div style={{ fontSize: 10, color: "#666" }}>
                    {team.college || ""}
                </div>
            </div>
        </SeedTeam>
    );

    return (
        <Wrapper mobileBreakpoint={breakpoint} seed={seed}>
            <SeedItem style={{ maxWidth: "300px" }}>
                <div>
                    {renderTeam(seed.teams?.[0])}
                    <div
                        style={{
                            height: 1,
                            backgroundColor: "#707070",
                            margin: "8px 0",
                        }}
                    />
                    {renderTeam(seed.teams?.[1])}
                </div>
            </SeedItem>
            <SeedTime mobileBreakpoint={breakpoint} style={{ fontSize: 9 }}>
                {seed.date}
            </SeedTime>
        </Wrapper>
    );
};

const GetBracket = () => {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "1200px" },
                margin: "auto",
                padding: 4,
                background: "rgba(255,255,255,0.9)",
                borderRadius: "12px",
                boxShadow: 3,
                overflowX: "visible",
            }}
        >
            <Box sx={{ textAlign: "center", marginBottom: 3 }}>
                <Typography variant="h4" component="h1">
                    Tournament: Brick City
                </Typography>
                <Typography variant="h6" component="h2">
                    Status: Completed
                </Typography>
            </Box>
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "1000px" },
                    overflowX: "auto",
                    padding: "20px",
                }}
            >
                <Bracket
                    rounds={rounds}
                    renderSeedComponent={RenderSeed}
                    mobileBreakpoint={0}
                    swipeableProps={{
                        enableMouseEvents: true,
                        animateHeight: true,
                    }}
                    twoSided={true}
                />
            </Box>
        </Box>
    );
};

export { GetBracket };
