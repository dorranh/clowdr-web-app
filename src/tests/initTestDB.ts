// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IBase, RelationsToTableNames, WholeSchema, WholeSchemaKeys } from "../classes/DataLayer/WholeSchema";
import initParseNode from "./initParseNode";
import Parse from "parse/node";

type SchemaRemapped<T> = {
    [K in keyof T]:
    T[K] extends Promise<Array<infer S>>
    ? (S extends IBase<any> ? Array<string> : never) // multiple ids
    : T[K] extends Promise<NonNullable<infer S>>
    ? (S extends IBase<any> ? string : never) // nullable id
    : T[K] extends Promise<infer S | null>
    ? (S extends IBase<any> ? string | null : never) // id
    : T[K]
};

export type TestDataT<K extends WholeSchemaKeys> = SchemaRemapped<WholeSchema[K]["value"]>;

export type TestDBData = {
    [K in WholeSchemaKeys]: Array<TestDataT<K>>
};

type ParseRestRequestObject = {
    method: "POST",
    path: string,
    body: any
};

export function generateMockPassword(userId: string) {
    return "mock";
}

function generateAttachmentTypes(): Array<TestDataT<"AttachmentType">> {
    let result: Array<TestDataT<"AttachmentType">> = [];

    result.push({
        conference: "mockConference1",
        id: "mockAttachmentType1",
        createdAt: new Date(1),
        displayAsLink: true,
        isCoverImage: false,
        name: "Mock AttachmentType",
        ordinal: 0,
        supportsFile: false,
        updatedAt: new Date(1)
    });

    return result;
}

function generateConferences(): Array<TestDataT<"Conference">> {
    let result: Array<TestDataT<"Conference">> = [];

    result.push({
        adminEmail: "mockAdminEmail@mock.com",
        adminName: "mockAdminName",
        conferenceName: "Mock Conference Name",
        createdAt: new Date(),
        headerImage: null,
        id: "mockConference1",
        isInitialized: false,
        landingPage: "A mock landing page",
        loggedInText: "mockPrivilegedConferenceDetails1",
        updatedAt: new Date(),
        welcomeText: "Welcome to this mock conference!"
    });

    result.push({
        adminEmail: "mockAdminEmail2@mock.com",
        adminName: "mockAdminName2",
        conferenceName: "A Second Mock Conference",
        createdAt: new Date(),
        headerImage: null,
        id: "mockConference2",
        isInitialized: false,
        landingPage: "A mock landing page",
        loggedInText: "mockPrivilegedConferenceDetails2",
        updatedAt: new Date(),
        welcomeText: "Welcome to this second mock conference!"
    });

    return result;
}

function generateFlairs(): Array<TestDataT<"Flair">> {
    let result: Array<TestDataT<"Flair">> = [];

    result.push({
        createdAt: new Date(),
        id: "mockFlair1",
        updatedAt: new Date(),
        color: "#FF00FF",
        label: "mock flair label",
        tooltip: "mock flair tooltip",
        priority: 1
    });

    return result;
}

function generatePrivilegedConferenceDetails(): Array<TestDataT<"PrivilegedConferenceDetails">> {
    let result: Array<TestDataT<"PrivilegedConferenceDetails">> = [];

    result.push({
        conference: "mockConference1",
        createdAt: new Date(),
        id: "mockPrivilegedConferenceDetails1",
        key: "LOGGED_IN_TEXT",
        updatedAt: new Date(),
        value: "Welcome to this mock conference logged in text."
    });

    result.push({
        conference: "mockConference2",
        createdAt: new Date(),
        id: "mockPrivilegedConferenceDetails2",
        key: "LOGGED_IN_TEXT",
        updatedAt: new Date(),
        value: "Welcome to this mock conference logged in text."
    });

    return result;
}

function generateUsers(): Array<TestDataT<"_User">> {
    let result: Array<TestDataT<"_User">> = [];

    let userId = "mockUser1";
    result.push({
        email: "mock@mock.com",
        createdAt: new Date(),
        id: userId,
        isBanned: "No",
        loginKey: null,
        passwordSet: true,
        profiles: [], // ["mockUserProfile1"],
        updatedAt: new Date(),
        username: "mockUser1",
        password: generateMockPassword(userId)
    } as any);

    return result;
}

function generateUserPresences(): Array<TestDataT<"UserPresence">> {
    let result: Array<TestDataT<"UserPresence">> = [];

    result.push({
        createdAt: new Date(),
        id: "mockUserPresence1",
        updatedAt: new Date(),
        isAvailable: false,
        isDND: false,
        isDNT: false,
        isLookingForConversation: false,
        isOnline: false,
        isOpenToConversation: false,
        status: "mock user presence status",
        socialSpace: null,
        user: "mockUser1",
    });

    return result;
}

function generateUserProfiles(): Array<TestDataT<"UserProfile">> {
    let result: Array<TestDataT<"UserProfile">> = [];

    result.push({
        id: "mockUserProfile1",
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliation: "mock affiliation",
        bio: "mock bio",
        country: "mock country",
        displayName: "mock display name",
        position: "mock position",
        profilePhoto: null, // TODO: Mock profile photo file
        pronouns: "test pronouns",
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
        primaryFlair: "mockFlair1",
        presence: "mockUserPresence1",
        programPersons: [], // TODO: Mock program persons
        user: "mockUser1",
        watchedRooms: [] // TODO: Mock watched rooms
    });

    return result;
}

function convertToRequestObjs<K extends WholeSchemaKeys>(tableName: K, items: Array<TestDataT<K>>): Array<ParseRestRequestObject> {
    let RelationFields = RelationsToTableNames[tableName as WholeSchemaKeys] as Record<string, string>;
    return items.map(item => {
        let object: ParseRestRequestObject = {
            method: "POST",
            path: "/parse/classes/" + tableName,
            body: {}
        };
        for (let fieldName in item) {
            let fieldValue = item[fieldName];
            if (fieldName === "id") {
                object.body["objectId"] = fieldValue;
            }
            else {
                if (fieldName in RelationFields) {
                    let finalValue: any;
                    let relatedTableName = RelationFields[fieldName];
                    if (Array.isArray(fieldValue)) {
                        let ids: Array<string> = fieldValue;
                        if (ids.length > 0) {
                            finalValue = ids.map(id => ({
                                __type: "Pointer",
                                className: relatedTableName,
                                objectId: id
                            }));

                            // object.body[fieldName] = {
                            //     __op: "AddRelation",
                            //     objects: finalValue
                            // };
                        }
                    }
                    else {
                        finalValue = {
                            __type: "Pointer",
                            className: relatedTableName,
                            objectId: fieldValue
                        };
                    }
                    object.body[fieldName] = finalValue;
                }
                else {
                    let _fieldValue = fieldValue as any;
                    if (_fieldValue instanceof Date) {
                        object.body[fieldName] = {
                            __type: "Date",
                            iso: _fieldValue.toISOString()
                        };
                    }
                    else if (_fieldValue instanceof File) {
                        throw new Error("File fields not supported");
                    }
                    else {
                        object.body[fieldName] = fieldValue;
                    }
                }
            }
        }
        return object;
    });
}

export async function initTestDB(updateDB: boolean = true): Promise<TestDBData> {
    if (updateDB) {
        initParseNode();
    }

    let result: TestDBData = {
        AttachmentType: [],
        BondedChannel: [],
        BreakoutRoom: [],
        Conference: [],
        ConferenceConfiguration: [],
        ConferencePermission: [],
        Conversation: [],
        Flair: [],
        LiveActivity: [],
        MeetingRegistration: [],
        PrivilegedAction: [],
        PrivilegedConferenceDetails: [],
        ProgramItem: [],
        ProgramItemAttachment: [],
        ProgramPerson: [],
        ProgramRoom: [],
        ProgramSession: [],
        ProgramSessionEvent: [],
        ProgramTrack: [],
        Registration: [],
        SocialSpace: [],
        TwilioChannelMirror: [],
        _User: [],
        UserPresence: [],
        UserProfile: [],
        ZoomHostAccount: [],
        ZoomRoom: []
    };

    let purgePromises = [];
    for (let tableName in result) {
        try {
            if (tableName === "_User") {
                purgePromises.push(new Parse.Query<Parse.User>("_User").map(user => {
                    return user.destroy();
                }));
            }
            else {
                let schema = new Parse.Schema(tableName);
                purgePromises.push(schema.purge());
            }
        }
        catch (e) {
            console.warn(e);
        }
    }
    await Promise.all(purgePromises);

    let allItems: Array<ParseRestRequestObject> = [];

    result.AttachmentType = generateAttachmentTypes();
    allItems = allItems.concat(convertToRequestObjs("AttachmentType", result.AttachmentType));

    result.Conference = generateConferences();
    allItems = allItems.concat(convertToRequestObjs("Conference", result.Conference));

    result.Flair = generateFlairs();
    allItems = allItems.concat(convertToRequestObjs("Flair", result.Flair));

    result.PrivilegedConferenceDetails = generatePrivilegedConferenceDetails();
    allItems = allItems.concat(convertToRequestObjs("PrivilegedConferenceDetails", result.PrivilegedConferenceDetails));

    result._User = generateUsers();
    allItems = allItems.concat(convertToRequestObjs("_User", result._User));

    result.UserPresence = generateUserPresences();
    allItems = allItems.concat(convertToRequestObjs("UserPresence", result.UserPresence));

    result.UserProfile = generateUserProfiles();
    allItems = allItems.concat(convertToRequestObjs("UserProfile", result.UserProfile));

    if (allItems.length > 50) {
        throw new Error("Test data too long.");
    }

    // TODO: Check for duplicate ids

    if (updateDB) {
        const RESTController = require('parse/lib/node/RESTController');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let restResult = await RESTController.request('POST', 'batch', {
            requests: allItems
        });
        if (Array.isArray(restResult)) {
            for (let result of restResult) {
                let resultJSON = JSON.stringify(result);
                if (resultJSON.includes("error")) {
                    console.error(result);
                    throw new Error(`Failed to create test data:\n${resultJSON}`);
                }
            }
        }
    }

    return result;
}
