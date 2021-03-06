const moment = require("moment");

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
//                                                           //
// This is unmaintained and now very very far out of date... //
//                                                           //
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

// Copied from WholeSchema.ts
const RelationsToTableNames = {
    AttachmentType: {
        conference: "Conference"
    },
    Conference: {
    },
    ConferenceConfiguration: {
        conference: "Conference"
    },
    Flair: {
        conference: "Conference"
    },
    PrivilegedConferenceDetails: {
        conference: "Conference"
    },
    ProgramItem: {
        conference: "Conference",
        authors: "ProgramPerson",
        track: "ProgramTrack"
    },
    ProgramItemAttachment: {
        attachmentType: "AttachmentType",
        programItem: "ProgramItem"
    },
    ProgramPerson: {
        conference: "Conference",
        profile: "UserProfile",
    },
    ContentFeed: {
        conference: "Conference",
        zoomRoom: "ZoomRoom",
        textChat: "TextChat",
        videoRoom: "VideoRoom",
    },
    ProgramSession: {
        conference: "Conference",
        track: "ProgramTrack",
        feed: "ContentFeed"
    },
    ProgramSessionEvent: {
        conference: "Conference",
        item: "ProgramItem",
        session: "ProgramSession",
    },
    ProgramTrack: {
        conference: "Conference",
    },
    Registration: {
        conference: "Conference",
    },
    _Role: {
        conference: "Conference",
        users: "_User",
        roles: "_Role"
    },
    _User: {
        profiles: "UserProfile"
    },
    UserProfile: {
        conference: "Conference",
        primaryFlair: "Flair",
        user: "_User"
    },
    ZoomRoom: {
        conference: "Conference",
    },
    TextChat: {
        conference: "Conference"
    },
    TextChatMessage: {
        chat: "TextChat"
    },
    VideoRoom: {
        conference: "Conference"
    }
};

function generateMockPassword(userId) {
    return "admin";
}

function generateAttachmentTypes() {
    let result = [];

    result.push({
        extra: undefined,
        fileTypes: ["image/png"],
        conference: "mockConference1",
        id: "mockAttachmentType1",
        createdAt: new Date(1),
        displayAsLink: true,
        isCoverImage: false,
        name: "Mock AttachmentType",
        ordinal: 0,
        supportsFile: false,
        updatedAt: new Date(1),

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "mockUser1": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
            "mockUser1",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    return result;
}

function generateConferences() {
    let result = [];

    result.push({
        details: ["mockPrivilegedConferenceDetails1"],

        name: "Mock Conference Name 1",
        shortName: "CONFA 2020",
        createdAt: new Date(),
        headerImage: null,
        id: "mockConference1",
        isInitialized: false,
        landingPage: "A mock landing page",
        updatedAt: new Date(),
        welcomeText: "Welcome to this mock conference!",
        lastProgramUpdateTime: new Date(),

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "*": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager"
        ],
        _rperm: ["*"],
    });

    result.push({
        details: ["mockPrivilegedConferenceDetails2"],

        name: "Mock Conference Name 2",
        shortName: "CONFB 2020",
        createdAt: new Date(),
        headerImage: null,
        id: "mockConference2",
        isInitialized: false,
        landingPage: "A second mock landing page",
        updatedAt: new Date(),
        welcomeText: "Welcome to this second mock conference!",
        lastProgramUpdateTime: new Date(),

        _acl: {
            "role:mockConference2-admin": { w: true },
            "role:mockConference2-manager": { w: true },
            "*": { r: true }
        },
        _wperm: [
            "role:mockConference2-admin",
            "role:mockConference2-manager"
        ],
        _rperm: ["*"],
    });

    return result;
}

function generateFlairs() {
    let result = [];

    const colors = ["#FF00FF", "#0000FF", "#FF0000"];
    const labels = ["organizing committee", "student volunteer", "job search"];

    for (let i = 1; i <= 3; i++) {
        result.push({
            createdAt: new Date(),
            id: "mockFlair" + i,
            updatedAt: new Date(),
            color: colors[i - 1],
            label: labels[i - 1],
            tooltip: "mock flair tooltip",
            priority: i,
            conference: "mockConference1",

            _acl: {
                "role:mockConference1-admin": { w: true },
                "role:mockConference1-attendee": { r: true }
            },
            _wperm: [
                "role:mockConference1-admin",
            ],
            _rperm: ["role:mockConference1-attendee"],
        });
    }

    result.push({
        createdAt: new Date(),
        id: "<empty>",
        updatedAt: new Date(),
        color: "#000000",
        label: "<empty>",
        tooltip: "",
        priority: 0,
        conference: "mockConference1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    return result;
}

function generatePrivilegedConferenceDetails() {
    let result = [];

    result.push({
        conference: "mockConference1",
        createdAt: new Date(),
        id: "mockPrivilegedConferenceDetails1",
        key: "LOGGED_IN_TEXT",
        updatedAt: new Date(),
        value: "Welcome to this mock conference logged in text.",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference2",
        createdAt: new Date(),
        id: "mockPrivilegedConferenceDetails2",
        key: "LOGGED_IN_TEXT",
        updatedAt: new Date(),
        value: "Welcome to this mock conference logged in text.",

        _acl: {
            "role:mockConference2-admin": { w: true },
            "role:mockConference2-manager": { w: true },
            "role:mockConference2-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference2-admin",
            "role:mockConference2-manager",
        ],
        _rperm: ["role:mockConference2-attendee"],
    });

    return result;
}

function generateRoles() {
    let result = [];

    result.push({
        id: "mockConference1-admin",
        name: "mockConference1-admin",
        conference: "mockConference1",
        _wperm: ["mockConference1-admin"],
        _rperm: ["*"],
        _acl: {
            "mockConference1-admin": { w: true },
            "*": { r: true }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        users: ["mockUser1"],
        roles: []
    });

    result.push({
        id: "mockConference1-manager",
        name: "mockConference1-manager",
        conference: "mockConference1",
        _wperm: ["mockConference1-admin"],
        _rperm: ["*"],
        _acl: {
            "mockConference1-admin": { w: true },
            "*": { r: true }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        roles: ["mockConference1-admin"]
    });

    result.push({
        id: "mockConference1-attendee",
        name: "mockConference1-attendee",
        conference: "mockConference1",
        _wperm: ["mockConference1-admin"],
        _rperm: ["*"],
        _acl: {
            "mockConference1-admin": { w: true },
            "*": { r: true }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        users: ["mockUser2", "mockUser3"],
        roles: ["mockConference1-manager"]
    });

    return result;
}

function generateUsers() {
    let result = [];

    for (let i = 1; i <= 3; i++) {
        const acl = {};
        acl["mockUser" + i] = { w: true, r: true };

        result.push({
            email: i === 1 ? "mock@mock.com" : "mock" + i + "@mock.com",
            emailVerified: true,
            createdAt: new Date(),
            id: "mockUser" + i,
            passwordSet: true,
            updatedAt: new Date(),
            username: "mockUser" + i,
            profiles: ["mockUserProfile" + i],
            // Password is 'admin'
            _hashed_password: "$2b$10$U1dOIN.fger7QO4sS9kwSelJdQgrr7D2hUCX5G4oMNR7uAPFQeXS2",

            _acl: acl,
            _wperm: ["mockUser" + i],
            _rperm: ["mockUser" + i],
        });
    }

    return result;
}

function generateUserProfiles() {
    let result = [];

    for (let i = 1; i <= 3; i++) {
        const acl = {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-attendee": { r: true }
        };
        acl["mockUser" + i] = { r: true, w: true };

        const bio =
            `Commodo sint nostrud sunt magna laboris adipisicing tempor aute eiusmod non et sint
            aliqua nisi. Culpa magna pariatur ea et adipisicing magna nulla laboris labore irure
            tempor officia veniam id. Dolore reprehenderit mollit elit cupidatat culpa dolore aliqua
            magna quis non commodo.`;

        result.push({
            dataConsentGiven: true,
            flairs: ["mockFlair" + i],

            id: "mockUserProfile" + i,
            createdAt: new Date(),
            updatedAt: new Date(),
            affiliation: "mock affiliation",
            bio: bio,
            country: "mock country",
            displayName: "mock display name " + i,
            position: "mock position",
            profilePhoto: null, // TODO: Mock profile photo file
            pronouns: ["test", "pronouns"],
            realName: "mock real name",
            tags: [
                {
                    alwaysShow: true,
                    label: "mock tag label 1",
                    priority: 1,
                    tooltip: "mock tag tooltip 1"
                }, {
                    alwaysShow: false,
                    label: "mock tag label 2",
                    priority: 2,
                    tooltip: "mock tag tooltip 2"
                }
            ],
            webpage: "http://mock.webpage.com/someurl?queryparams=somequery!",
            welcomeModalShown: false,
            conference: "mockConference1",
            primaryFlair: "mockFlair" + i,
            programPersons: [], // TODO: Mock program persons
            user: "mockUser" + i,

            _acl: acl,
            _wperm: [
                "role:mockConference1-admin",
                "mockUser" + i,
            ],
            _rperm: [
                "role:mockConference1-attendee",
                "mockUser" + i,
            ],
        });
    }

    return result;
}


/********* AUTO GENERATED using clowdr-db-schema/scripts/programCSV2TestDataGen.js ************/

function generateProgramTrack() {
    let result = [];

    result.push({
        conference: "mockConference1",
        id: "mockConference1-track-0",
        createdAt: new Date(),
        updatedAt: new Date(),

        colour: "#000000",
        name: "Research Papers",
        shortName: "RP",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-track-1",
        createdAt: new Date(),
        updatedAt: new Date(),

        colour: "#000000",
        name: "Q&A",
        shortName: "Q&A",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-track-2",
        createdAt: new Date(),
        updatedAt: new Date(),

        colour: "#000000",
        name: "Posters",
        shortName: "Posters",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });


    return result;
}

function generateProgramSession() {
    let result = [];

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-0",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Session - NY 1",
        endTime: new Date(1601250300000),
        startTime: new Date(1601247600000),
        feed: "mockConference1-feed-0",
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Q&A - NY1",
        endTime: new Date(1601251200000),
        startTime: new Date(1601248500000),
        feed: "mockConference1-feed-1",
        track: "mockConference1-track-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-2",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Session - NY 2",
        endTime: new Date(1601255700000),
        startTime: new Date(1601253000000),
        feed: "mockConference1-feed-2",
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-3",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Q&A - NY2",
        endTime: new Date(1601256600000),
        startTime: new Date(1601253900000),
        feed: "mockConference1-feed-3",
        track: "mockConference1-track-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-4",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Session - Beijing 1",
        endTime: new Date(1601973900000),
        startTime: new Date(1601971200000),
        feed: "mockConference1-feed-4",
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-5",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Q&A - Beijing 1",
        endTime: new Date(1601974800000),
        startTime: new Date(1601972100000),
        feed: "mockConference1-feed-5",
        track: "mockConference1-track-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-6",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Session - Beijing 2",
        endTime: new Date(1601979300000),
        startTime: new Date(1601976600000),
        feed: "mockConference1-feed-6",
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-session-7",
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Demo Q&A - Beijing 2",
        endTime: new Date(1601980200000),
        startTime: new Date(1601977500000),
        feed: "mockConference1-feed-7",
        track: "mockConference1-track-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });


    return result;
}

function generateContentFeed() {
    let result = [];

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-0",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "YT feed - NY 1",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Zoom - Q&A NY 1",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-2",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "YT feed - NY 2",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-3",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Zoom - Q&A NY 2",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-4",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "YT feed - Beijing 1",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-5",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Zoom - Q&A Beijing 1",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-6",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "YT feed - Beijing 2",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-feed-7",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Zoom - Q&A Beijing 2",
        textChat: undefined,
        videoRoom: undefined,
        zoomRoom: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });


    return result;
}

function generateProgramItem() {
    let result = [];

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-0",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A balanced proxy technology applied to a balanced secure algorithm",
        authors: ["mockConference1-person-0", "mockConference1-person-1", "mockConference1-person-2"],
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "An interactive binary hypervisor applied to a conceptual big data system",
        authors: ["mockConference1-person-3", "mockConference1-person-4"],
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-2",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A conceptual secure agent derived from an integrated high-speed solution",
        authors: ["mockConference1-person-5"],
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-3",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "An integrated functional technology applied to a responsive programmable architecture",
        authors: ["mockConference1-person-6", "mockConference1-person-7", "mockConference1-person-8", "mockConference1-person-9", "mockConference1-person-10"],
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-4",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A conceptual proxy cache for a scalable functional algorithm",
        authors: ["mockConference1-person-11", "mockConference1-person-12"],
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-5",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A virtual knowledge-based interface for an open programmable data center",
        authors: ["mockConference1-person-13", "mockConference1-person-14", "mockConference1-person-15"],
        track: "mockConference1-track-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-6",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A virtual logical network applied to a synchronized logical algorithm",
        authors: ["mockConference1-person-6", "mockConference1-person-7", "mockConference1-person-8", "mockConference1-person-9", "mockConference1-person-10"],
        track: "mockConference1-track-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-7",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A parallel secure architecture for a collaborative big data network",
        authors: ["mockConference1-person-11", "mockConference1-person-12"],
        track: "mockConference1-track-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-8",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "An optimized digital compiler related to a meta-level watermarking preprocessor",
        authors: ["mockConference1-person-13", "mockConference1-person-14", "mockConference1-person-15"],
        track: "mockConference1-track-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-9",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A meta-level distributed architecture derived from a collaborative functional data center",
        authors: ["mockConference1-person-16", "mockConference1-person-17"],
        track: "mockConference1-track-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-10",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "An active functional toolkit related to a virtual programmable protocol",
        authors: ["mockConference1-person-18", "mockConference1-person-19"],
        track: "mockConference1-track-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-11",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A scalable concurrent interface embedded in a coordinated proxy compiler",
        authors: ["mockConference1-person-20", "mockConference1-person-21", "mockConference1-person-22"],
        track: "mockConference1-track-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-12",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "An active object-oriented system derived from an interactive parallelizing language",
        authors: ["mockConference1-person-23", "mockConference1-person-24", "mockConference1-person-25", "mockConference1-person-26"],
        track: "mockConference1-track-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-13",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A reliable parallelizing preprocessor embedded in a coordinated binary system",
        authors: ["mockConference1-person-27"],
        track: "mockConference1-track-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-14",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A virtual big data solution related to a high-level knowledge-based language",
        authors: ["mockConference1-person-28"],
        track: "mockConference1-track-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-item-15",
        createdAt: new Date(),
        updatedAt: new Date(),
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue metus purus. Proin sit amet ligula efficitur, pharetra lectus sit amet, posuere dolor. Fusce congue, diam quis venenatis vehicula, enim velit aliquet felis, ut pharetra leo massa eu nisi. Suspendisse vel libero iaculis, pulvinar nibh ut, feugiat nisi. Sed id neque quis magna sagittis porttitor ac ac tortor. Curabitur sed quam nec enim malesuada vulputate non ornare metus. Nullam venenatis laoreet ipsum, quis euismod mauris sagittis quis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse cursus massa et hendrerit euismod.",
        posterImage: undefined,
        title: "A high-level real-time system related to a reliable cloud-based architecture",
        authors: ["mockConference1-person-29"],
        track: "mockConference1-track-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });


    return result;
}

function generateProgramPerson() {
    let result = [];

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-0",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Drucilla Euell",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Sophie Tinker",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-2",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Elfreda Mchargue",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-3",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Letty Tuch",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-4",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Antonette Bassham",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-5",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Katrice Russel",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-6",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Max Colby",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-7",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Shante Moeller",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-8",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Jerry Eves",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-9",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Adrianna Bolton",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-10",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Augustus Colombo",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-11",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Rene Papageorge",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-12",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Chia Lenart",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-13",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Gwyneth Kresge",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-14",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Elin Fahnestock",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-15",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Lasonya Zapien",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-16",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Stephanie Finnie",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-17",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Melissa Demoura",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-18",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Luetta Waugh",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-19",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Cathleen Dupras",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-20",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Ione Shannon",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-21",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Tonya Due",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-22",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Wilber Zelinski",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-23",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Priscila Godsey",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-24",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Mechelle Mcpeters",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-25",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Leontine Balis",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-26",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Danette Sunderman",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-27",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Sena Raabe",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-28",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Mac Blanks",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-person-29",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Dorene Warshaw",
        profile: undefined,

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });


    return result;
}

function generateProgramSessionEvent() {
    let result = [];

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-0",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601248500000),
        startTime: new Date(1601247600000),
        item: "mockConference1-item-0",
        session: "mockConference1-session-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601249400000),
        startTime: new Date(1601248500000),
        item: "mockConference1-item-1",
        session: "mockConference1-session-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-2",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601250300000),
        startTime: new Date(1601249400000),
        item: "mockConference1-item-2",
        session: "mockConference1-session-0",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-3",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601249400000),
        startTime: new Date(1601248500000),
        item: "mockConference1-item-0",
        session: "mockConference1-session-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-4",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601250300000),
        startTime: new Date(1601249400000),
        item: "mockConference1-item-1",
        session: "mockConference1-session-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-5",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601251200000),
        startTime: new Date(1601250300000),
        item: "mockConference1-item-2",
        session: "mockConference1-session-1",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-6",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601253900000),
        startTime: new Date(1601253000000),
        item: "mockConference1-item-3",
        session: "mockConference1-session-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-7",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601254800000),
        startTime: new Date(1601253900000),
        item: "mockConference1-item-4",
        session: "mockConference1-session-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-8",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601255700000),
        startTime: new Date(1601254800000),
        item: "mockConference1-item-5",
        session: "mockConference1-session-2",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-9",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601254800000),
        startTime: new Date(1601253900000),
        item: "mockConference1-item-6",
        session: "mockConference1-session-3",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-10",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601255700000),
        startTime: new Date(1601254800000),
        item: "mockConference1-item-7",
        session: "mockConference1-session-3",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-11",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601256600000),
        startTime: new Date(1601255700000),
        item: "mockConference1-item-8",
        session: "mockConference1-session-3",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-12",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601972100000),
        startTime: new Date(1601971200000),
        item: "mockConference1-item-0",
        session: "mockConference1-session-4",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-13",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601973000000),
        startTime: new Date(1601972100000),
        item: "mockConference1-item-1",
        session: "mockConference1-session-4",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-14",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601973900000),
        startTime: new Date(1601973000000),
        item: "mockConference1-item-2",
        session: "mockConference1-session-4",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-15",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601973000000),
        startTime: new Date(1601972100000),
        item: "mockConference1-item-0",
        session: "mockConference1-session-5",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-16",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601973900000),
        startTime: new Date(1601973000000),
        item: "mockConference1-item-1",
        session: "mockConference1-session-5",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-17",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601974800000),
        startTime: new Date(1601973900000),
        item: "mockConference1-item-2",
        session: "mockConference1-session-5",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-18",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601977500000),
        startTime: new Date(1601976600000),
        item: "mockConference1-item-3",
        session: "mockConference1-session-6",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-19",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601978400000),
        startTime: new Date(1601977500000),
        item: "mockConference1-item-4",
        session: "mockConference1-session-6",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-20",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601979300000),
        startTime: new Date(1601978400000),
        item: "mockConference1-item-5",
        session: "mockConference1-session-6",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-21",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601978400000),
        startTime: new Date(1601977500000),
        item: "mockConference1-item-6",
        session: "mockConference1-session-7",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-22",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601979300000),
        startTime: new Date(1601978400000),
        item: "mockConference1-item-7",
        session: "mockConference1-session-7",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });

    result.push({
        conference: "mockConference1",
        id: "mockConference1-event-23",
        createdAt: new Date(),
        updatedAt: new Date(),
        directLink: undefined,
        endTime: new Date(1601980200000),
        startTime: new Date(1601979300000),
        item: "mockConference1-item-8",
        session: "mockConference1-session-7",

        _acl: {
            "role:mockConference1-admin": { w: true },
            "role:mockConference1-manager": { w: true },
            "role:mockConference1-attendee": { r: true }
        },
        _wperm: [
            "role:mockConference1-admin",
            "role:mockConference1-manager",
        ],
        _rperm: ["role:mockConference1-attendee"],
    });


    return result;
}

/********* END AUTO GENERATED ************/



function convertObjectToMongoJSON(tableName, item, result) {
    let RelationFields = RelationsToTableNames[tableName];
    let object = {
    };
    for (let fieldName in item) {
        let fieldValue = item[fieldName];
        if (fieldName === "id") {
            object["_id"] = fieldValue;
        }
        else {
            if (fieldName in RelationFields) {
                let relatedTableName = RelationFields[fieldName];
                if (Array.isArray(fieldValue)) {
                    let ids = fieldValue;
                    let relationName = `_Join:${fieldName}:${tableName}`;
                    if (ids.length > 0) {
                        if (!result[relationName]) {
                            result[relationName] = [];
                        }

                        let finalValue = ids.map(id => ({
                            relatedId: id,
                            owningId: item.id
                        }));

                        result[relationName] = result[relationName].concat(finalValue);
                    }
                    else {
                        result[relationName] = result[relationName] || [];
                    }
                }
                else if (fieldValue) {
                    object[`_p_${fieldName}`] = `${relatedTableName}$${fieldValue}`;
                }
            }
            else {
                if (fieldValue !== null && fieldValue !== undefined) {
                    if (fieldValue instanceof Date) {

                        if (fieldName === "updatedAt") {
                            fieldName = "_updated_at";
                        }
                        else if (fieldName === "createdAt") {
                            fieldName = "_created_at";
                        }

                        object[fieldName] = fieldValue;
                    }
                    else if (fieldValue instanceof Array) {
                        object[fieldName] = fieldValue;
                    }
                    else if (typeof fieldValue === "number") {
                        object[fieldName] = fieldValue.toString();
                    }
                    else if (typeof fieldValue === "string") {
                        object[fieldName] = fieldValue;
                    }
                    else if (typeof fieldValue === "boolean") {
                        object[fieldName] = fieldValue;
                    }
                    else if (typeof fieldValue === "object") {
                        object[fieldName] = fieldValue;
                    }
                    else {
                        throw new Error(`Unhandled field type! ${typeof fieldValue}`);
                    }
                }
            }
        }
    }
    return object;
}

function convertToMongoJSON(tableName, items, result) {
    result[tableName] = items.map(item => {
        return convertObjectToMongoJSON(tableName, item, result);
    });
}

module.exports = {
    generateTestData: () => {
        let result = {
            AttachmentType: [],
            Conference: [],
            ConferenceConfiguration: [],
            Conversation: [],
            Flair: [],
            LiveActivity: [],
            PrivilegedConferenceDetails: [],
            ProgramItem: [],
            ProgramItemAttachment: [],
            ProgramPerson: [],
            ContentFeed: [],
            ProgramSession: [],
            ProgramSessionEvent: [],
            ProgramTrack: [],
            Registration: [],
            SocialSpace: [],
            _User: [],
            UserProfile: [],
            ZoomRoom: []
        };

        let allItems = {};

        result.AttachmentType = generateAttachmentTypes();
        convertToMongoJSON("AttachmentType", result.AttachmentType, allItems);

        result.Conference = generateConferences();
        convertToMongoJSON("Conference", result.Conference, allItems);

        result.Flair = generateFlairs();
        convertToMongoJSON("Flair", result.Flair, allItems);

        result.PrivilegedConferenceDetails = generatePrivilegedConferenceDetails();
        convertToMongoJSON("PrivilegedConferenceDetails", result.PrivilegedConferenceDetails, allItems);

        result._Role = generateRoles();
        convertToMongoJSON("_Role", result._Role, allItems);

        result._User = generateUsers();
        convertToMongoJSON("_User", result._User, allItems);

        result.UserProfile = generateUserProfiles();
        convertToMongoJSON("UserProfile", result.UserProfile, allItems);

        result.ProgramItem = generateProgramItem();
        convertToMongoJSON("ProgramItem", result.ProgramItem, allItems);

        result.ProgramPerson = generateProgramPerson();
        convertToMongoJSON("ProgramPerson", result.ProgramPerson, allItems);

        result.ContentFeed = generateContentFeed();
        convertToMongoJSON("ContentFeed", result.ContentFeed, allItems);

        result.ProgramSession = generateProgramSession();
        convertToMongoJSON("ProgramSession", result.ProgramSession, allItems);

        result.ProgramSessionEvent = generateProgramSessionEvent();
        convertToMongoJSON("ProgramSessionEvent", result.ProgramSessionEvent, allItems);

        result.ProgramTrack = generateProgramTrack();
        convertToMongoJSON("ProgramTrack", result.ProgramTrack, allItems);

        return {
            data: result,
            json: allItems
        };
    },
    generateMockPassword: generateMockPassword
}
