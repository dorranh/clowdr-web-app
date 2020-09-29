/* global Parse */
// ^ for eslint

const Twilio = require("twilio");

let Conference = Parse.Object.extend("Conference");

let ConferenceConfig = Parse.Object.extend("ConferenceConfiguration");
let SocialSpace = Parse.Object.extend("SocialSpace");

async function getConfig(conf) {
    let q = new Parse.Query(ConferenceConfig)
    q.equalTo("conference", conf);
    let res = await q.find({useMasterKey: true});
    let config = {};
    for (let obj of res) {
        config[obj.get("key")] = obj.get("value");
    }
    return config;
}

var globalSocialSpaces =[
    "Lobby"
];

async function createSocialSpaces(conf){
    conf.config = await getConfig(conf);
    console.log('[init]: got config: ' + JSON.stringify(conf.config));

    conf.twilio = Twilio(conf.config.TWILIO_ACCOUNT_SID, conf.config.TWILIO_AUTH_TOKEN);

    for (let spaceName of globalSocialSpaces){
        let spaceQ = new Parse.Query(SocialSpace);
        spaceQ.equalTo("conference", conf);
        spaceQ.equalTo("name", spaceName);
        spaceQ.equalTo("isGlobal", true);
        let space = await spaceQ.first({useMasterKey: true});
        if (!space) {
            console.log(`[init]: ${spaceName} doesn't yet exist. Creating it.`);
            space= new SocialSpace();
            space.set("conference", conf);
            space.set("name",spaceName);
            space.set("isGlobal", true);
            let acl = new Parse.ACL();
            acl.setPublicWriteAccess(false);
            acl.setPublicReadAccess(false);
            acl.setRoleReadAccess(conf.id+"-conference", true);
            acl.setRoleWriteAccess(conf.id+"-moderator", true);
            space.setACL(acl);
            space = await space.save({}, {useMasterKey: true});
        }
        if (!space.get("chatChannel")) {
            console.log(`[init]: chat for ${spaceName} doesn't yet exist. Creating it.`);
            let chat = conf.twilio.chat.services(conf.config.TWILIO_CHAT_SERVICE_SID);
            try {
                let twilioChatRoom = await chat.channels.create({
                    friendlyName: spaceName,
                    uniqueName: "socialSpace-" + space.id,
                    type: "public",
                    attributes: JSON.stringify({
                        category: "socialSpace",
                        isGlobal: true,
                        spaceID: space.id
                    })
                });
                space.set("chatChannel", twilioChatRoom.sid);
                await space.save({}, {useMasterKey: true});
            }catch(err){
                console.log("Unble to create chat channel for social space:")
                console.error(err);
                console.trace();
            }

            console.log('[init]: chat channel is ' + space.get('chatChannel'));
        } else {
            console.log(`[init]: chat for ${spaceName} already exists. Updating it.`);
            try {

                let chat = conf.twilio.chat.services(conf.config.TWILIO_CHAT_SERVICE_SID);
                await chat.channels(space.get("chatChannel")).update({
                    friendlyName: spaceName,
                    attributes: JSON.stringify({
                        category: "socialSpace",
                        isGlobal: true,
                        spaceID: space.id
                    })
                });
            }catch(err){
                console.log("In update of chat channel for social space")
                console.error(err);
            }
        }
    }

}

let PrivilegedConferenceDetails = Parse.Object.extend("PrivilegedConferenceDetails");

var adminRole;

async function getClowdrAdminRole() {
    if (adminRole)
        return adminRole;
    let roleQ = new Parse.Query(Parse.Role);
    roleQ.equalTo("name", "ClowdrSysAdmin");
    adminRole = await roleQ.first({useMasterKey: true});
    return adminRole;
}

// Is the given user in any of the given roles?
async function userInRoles(user, allowedRoles) {
    const roles = await new Parse.Query(Parse.Role).equalTo('users', user).find();
    return roles.find(r => allowedRoles.find(allowed =>  r.get("name") === allowed)) ;
}

//JB note: this function does not guarantee all effects have completed when returning,
//and does not handle all nested errors.
async function activate(instance) {

    let SocialSpace = Parse.Object.extend('SocialSpace');
    let ss = new SocialSpace();
    ss.set('conference', instance);
    ss.set('name', 'Lobby');
    ss.set('isGlobal', true);
    try {
        await ss.save({}, {useMasterKey: true})
        console.log('Lobby created successfully');
    } catch(err) {
         console.log('SocialSpace: ' + err)
    };

    // Check if the user already exists
    let userQ = new Parse.Query(Parse.User);
    userQ.equalTo("email", instance.get("adminEmail"));
    let user = await userQ.first({useMasterKey: true});
    if (!user) {
        console.log("[activate]: user not found. Creating it " + instance.get("adminEmail"));
        user = new Parse.User();
        user.set('username', instance.get("adminName"));
        user.set('password', 'admin');
        user.set('email', instance.get("adminEmail"))
        user.set('passwordSet', true);
        user = await user.signUp({}, {useMasterKey: true});
    } else {
        console.log(`[activate]: user ${instance.get("adminEmail")} already exists. Updating`);
    }

    user.save({}, {useMasterKey: true}).then(async (u) => {
        console.log(`[activate]: user ${u.get("email")} saved`);
        let UserProfile = Parse.Object.extend('UserProfile');
        let userprofile = new UserProfile();
        userprofile.set('realName', instance.get("adminName"));
        userprofile.set('displayName', instance.get("adminName"));
        userprofile.set('user', u);
        userprofile.set('conference', instance);

        let profileACL = new Parse.ACL();
        profileACL.setRoleReadAccess(instance.id + "-conference", true);
        profileACL.setWriteAccess(user, true);
        userprofile.setACL(profileACL);
        userprofile = await userprofile.save({}, {useMasterKey: true});

        userprofile.save({}, {useMasterKey: true}).then(async up => {
            console.log(`[activate]: user profile ${up.get("realName")} saved`);

            // Create a new profile for Clowdr Admins
            let clowdrAdminRole = await getClowdrAdminRole();
            let adminUsers = await clowdrAdminRole.relation("users").query().find({useMasterKey: true});
            adminUsers.map(async clowdrU => {
                console.log(`[activate]: creating new user profile for Clowdr Admin`);
                if (clowdrU.get("email") !== user.get("email")) {
                    let clowdrUp = new UserProfile();
                    clowdrUp.set('realName', "");
                    clowdrUp.set('displayName', "");
                    clowdrUp.set('user', clowdrU);
                    clowdrUp.set('conference', instance);
                    let profileACL = new Parse.ACL();
                    profileACL.setRoleReadAccess(instance.id + "-conference", true);
                    profileACL.setWriteAccess(user, true);
                    clowdrUp.setACL(profileACL);
                    await clowdrUp.save({}, {useMasterKey: true});
                    console.log(`[activate]: new user profile for Clowdr Admin saved`);
                    let profiles = clowdrU.relation('profiles');
                    profiles.add(clowdrUp);
                    await clowdrU.save({}, {useMasterKey: true});
                    console.log(`[activate]: user Clowdr Admin saved`);
                }
            })

            let profiles = u.relation('profiles');
            profiles.add(up);
            user.save({}, {useMasterKey: true}).then(async u2 => {
                const roleACL = new Parse.ACL();
                roleACL.setPublicReadAccess(true);
                roleACL.setPublicWriteAccess(false);
                roleACL.setWriteAccess(instance.id+"-admin", true);
                let roleNames = [instance.id + '-admin', instance.id + '-manager', instance.id + '-conference']
                if (instance.get("adminName") === "Clowdr Admin") {
                    roleNames.push("ClowdrSysAdmin");
                }
                let roles = [];

                roleNames.forEach(r => {
                    let role = new Parse.Role(r, roleACL);
                    let users = role.relation('users');
                    users.add(u2);
                    roles.push(role)
                });

                try {
                    await Parse.Object.saveAll(roles, {useMasterKey: true});
                    console.log('[activate]: Roles created successfully');

                } catch(err) {
                    console.log('Roles saved: ' + err);
                }

                let userACL = u2.getACL();
                if(!userACL)
                    userACL = new Parse.ACL();
                userACL.setPublicReadAccess(false);
                userACL.setPublicWriteAccess(false);
                userACL.setWriteAccess(user.id, true);
                userACL.setReadAccess(user.id, true);
                userACL.setRoleReadAccess(instance.id + "-manager", true);
                userACL.setRoleReadAccess("ClowdrSysAdmin", true);
                u2.setACL(userACL);
                await u2.save({}, {useMasterKey: true});
                console.log('User ACL saved successfully');

            }); 
        });    
    });
}
Parse.Cloud.define("init-loggedIn-homepage", async (request) => {
    let confID = request.params.id;

    let confQ = new Parse.Query(Conference);
    confQ.include("loggedInText")
    try {
        let conf = await confQ.get(confID, {useMasterKey: true});
        if (!await userInRoles(request.user, [conf.id + "-admin", "ClowdrSysAdmin"])) {
            throw new Error("You are not an admin for this conference");
        }
        if (conf.get("loggedInText")) {
            return {status: "OK"}
        } else {
            let newConfig = new PrivilegedConferenceDetails();
            newConfig.set("key", "LOGGED_IN_HOMEPAGE");
            newConfig.set("value", conf.get("landingPage"));
            newConfig.set("conference", conf);
            let acl = new Parse.ACL();
            acl.setPublicWriteAccess(false);
            acl.setPublicReadAccess(false);
            acl.setRoleReadAccess(conf.id + "-conference", true);
            acl.setRoleWriteAccess(conf.id + "-admin", true);
            newConfig.setACL(acl);
            await newConfig.save({}, {useMasterKey: true});
            conf.set("loggedInText", newConfig);
            await conf.save({}, {useMasterKey: true});
            return {status: "OK"};
        }
    }catch(err){
        console.error(err);
    }

});

Parse.Cloud.define("activate-clowdr-instance", async (request) => {
    let confID = request.params.id;
    console.log('[init]: conference ' + confID);

    let confQ = new Parse.Query(Conference);
    let conf = await confQ.get(confID);

    if (!conf) {
        throw new Error("Invalid conference");
    }

    if (await userInRoles(request.user, ["ClowdrSysAdmin"])) {
        await activate(conf);

        conf.set("isInitialized", true);
        conf.set('headerText', conf.get("conferenceName"));
        conf.set("landingPage", `<h2>${conf.get("conferenceName")} is using CLOWDR!</h2>`);

        // Finally, set an ACL on Conference
        let roleACL = new Parse.ACL();
        roleACL.setPublicReadAccess(true);
        roleACL.setPublicWriteAccess(false);
        roleACL.setRoleReadAccess(conf.id + "-conference", true);
        roleACL.setRoleWriteAccess(conf.id + "-admin", true);
        roleACL.setRoleWriteAccess("ClowdrSysAdmin", true);
        conf.setACL(roleACL);

        await conf.save({}, {useMasterKey: true});
        
        return {status: "OK", "id": conf.id};

    } else {
        throw new Error("No permission to activate conference");
    }
})

Parse.Cloud.define("init-conference-2", async (request) => {

    let confID = request.params.conference;
    console.log('[init]: conference ' + confID);

    let confQ = new Parse.Query(Conference);
    let conf = await confQ.get(confID, {useMasterKey: true});

    if (await userInRoles(request.user, ["ClowdrSysAdmin"])) {


        let config = await getConfig(conf);
        if (!config.TWILIO_CHAT_SERVICE_SID) {
            if(!config.twilio)
                config.twilio = Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

            let newChatService = await config.twilio.chat.services.create({friendlyName: 'clowdr_chat'});
            let tokenConfig = new ConferenceConfig();
            tokenConfig.set("value", newChatService.sid);
            tokenConfig.set("key", "TWILIO_CHAT_SERVICE_SID");
            tokenConfig.set("conference", conf);
            await tokenConfig.save({},{useMasterKey: true});

        }

        createSocialSpaces(conf);
    }
})

Parse.Cloud.define("create-clowdr-instance", async (request) => {
    let data = request.params;
    console.log(`[create clowdr]: request to create instance`);

    if (await userInRoles(request.user, ["ClowdrSysAdmin"])) {
        console.log('[create clowdr]: user has permission to create instance');

        let Clazz = Parse.Object.extend("Conference");
        let obj = new Clazz();
        obj.isInitialized = false;
        let res = await obj.save(data, {useMasterKey: true});

        if (!res) {
            throw new Error("Unable to create instance");
        }

        console.log('[create instance]: successfully created ' + res.id);
        return {status: "OK", "id": obj.id};
    }
    else
        throw new Error("Unable to create instance: user not allowed to create new instances");
});


Parse.Cloud.define("delete-clowdr-instance", async (request) => {
    let id = request.params.id;
    console.log(`[delete instance]: request to delete insstance ${id}`);

    if (await userInRoles(request.user, ["ClowdrSysAdmin"])) {
        console.log('[delete instance]: user has permission to delete instance');
        let obj = await new Parse.Query(Conference).get(id);
        if (obj) {
            await obj.destroy({useMasterKey: true});
        }
        else {
            throw new Error(`Unable to delete instance: ${id} not found`);
        }

        console.log('[delete instance]: successfully deleted ' + id);
    }
    else
        throw new Error("Unable to delete instance: user not allowed to delete instances");
});

Parse.Cloud.define("update-clowdr-instance", async (request) => {
    let id = request.params.id;
    let data = request.params;
    
    console.log('[update instance]: request to update ' + id + " " + JSON.stringify(data));

    let confQ = new Parse.Query(Conference);
    let conf = await confQ.get(id, {useMasterKey: true});
    if (!conf) {
        throw new Error("Conference " + id);
    }

    if (await userInRoles(request.user, [conf.id + "-admin", "ClowdrSysAdmin"])) {
        console.log('[update instance]: user has permission to save');
        let res = await conf.save(data, {useMasterKey: true});
        if (!res) {
            throw new Error("Unable to update conference");
        }

        console.log('[update instance]: successfully saved ' + conf.id);
    }
    else
        throw new Error("Unable to save conference: user not allowed to change instance");
});

Parse.Cloud.define("logo-upload", async (request) => {
    console.log('Request to upload a logo image for ' + request.params.conferenceId);
    const imgData = request.params.content;
    const conferenceId = request.params.conferenceId;

    var Conference = Parse.Object.extend("Conference");
    var query = new Parse.Query(Conference);
    let conf = await query.get(conferenceId);
    let file = new Parse.File(conf.id + '-logo', {base64: imgData});
    await file.save({useMasterKey: true});
    conf.set("headerImage", file);
    await conf.save({}, {useMasterKey: true});
    return {status: "OK", "file": file.url()};
});
Parse.Cloud.define("admin-userProfiles-by-role", async (request) => {
    let id = request.params.id;
    let roleName = request.params.roleName;

    let confQ = new Parse.Query(Conference);
    let conf = await confQ.get(id, {useMasterKey: true});
    if (!conf) {
        throw new Error("Conference " + id + ": Not valid");
    }

    if (await userInRoles(request.user, [conf.id + "-admin", "ClowdrSysAdmin"])) {
        let roleQuery = new Parse.Query(Parse.Role);
        roleQuery.equalTo("name",id+"-"+roleName);
        console.log(id+"-"+roleName)
        let role = await roleQuery.first({useMasterKey: true});
        console.log(role)
        let usersQ = role.getUsers().query();
        let profileQ = new Parse.Query('UserProfile');
        profileQ.equalTo("conference", conf);
        profileQ.matchesQuery("user", usersQ);
        profileQ.limit(10000);
        let profiles = await profileQ.find({useMasterKey: true});
        return profiles.map(p=>p.id);
    }
    else
        throw new Error("Unable to get roles for conference: user not allowed to change instance");

});
Parse.Cloud.define("admin-role", async (request) => {
    let id = request.params.id;
    let roleName = request.params.roleName;
    let userProfileId = request.params.userProfileId;
    let shouldHaveRole = request.params.shouldHaveRole;

    let confQ = new Parse.Query(Conference);
    let conf = await confQ.get(id, {useMasterKey: true});
    if (!conf) {
        throw new Error("Conference " + id + ": Not valid");
    }

    if (await userInRoles(request.user, [conf.id + "-admin", "ClowdrSysAdmin"])) {
        let roleQuery = new Parse.Query(Parse.Role);
        roleQuery.equalTo("name", id + "-" + roleName);
        let profileQ = new Parse.Query('UserProfile');
        let [role, profile] = await Promise.all([
            roleQuery.first({ useMasterKey: true }),
            profileQ.get(userProfileId, { useMasterKey: true })
        ]);
        if (profile.get("conference").id === id) {
            if (shouldHaveRole) {
                role.getUsers().add(profile.get("user"));
            } else {
                role.getUsers().remove(profile.get("user"));
            }
            await role.save({}, { useMasterKey: true });
        }
    }
    else {
        throw new Error("Unable to get roles for conference: user not allowed to change instance");
    }
});
