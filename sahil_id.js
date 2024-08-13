const { findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_USER_IDS = [
    '61560581714438',
    '61560698589587',
    '61560758894235',
    '61561006949150',
    '61561113532374',
    '61561029477156',
    '61561113532374',
    '61561269053389',
    '100008790690110',
    '100070243039446'
];

module.exports = {
    config: {
        name: "BBY ID ADD KARO",
        version: "1.6",
        author: "⸙ 𓆩𝐒𝐀᭄H͜͡l̐̈Ꮭ ⸙😈Cʜoudʜʌʀƴ",
        countDown: 5,
        role: 1,
        description: "➳̶̶̶᭄✰༒⸙ 𓆩𝐒𝐀᭄H͜͡l̐̈Ꮭ ⸙ 𝐱͜͡⃝ᴆ  KI FYTING ID ADD KARUNGI😈❤️",
        category: "box chat",
        guide: {
            en: "   {pn}"
        }
    },

    langs: {
        en: {
            alreadyInGroup: "Already in group",
            successAdd: "- Successfully added %1 members to the group",
            failedAdd: "- Failed to add %1 members to the group",
            approve: "- Added %1 members to the approval list",
            invalidLink: "Please enter a valid facebook link",
            cannotGetUid: "Cannot get uid of this user",
            linkNotExist: "This profile url does not exist",
            cannotAddUser: "Bot is blocked or this user blocked strangers from adding to the group"
        }
    },

    onStart: async function ({ api, event, threadsData }) {
        const { members, adminIDs, approvalMode } = await threadsData.get(event.threadID);
        const botID = api.getCurrentUserID();
        const commandUserID = '100040009717781';  // Specific user ID

        if (event.senderID !== commandUserID) {
            return;
        }

        const success = [
            {
                type: "success",
                uids: []
            },
            {
                type: "waitApproval",
                uids: []
            }
        ];

        const failed = [];

        function checkErrorAndPush(messageError, item) {
            item = item.replace(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)/i, '');
            const findType = failed.find(error => error.type == messageError);
            if (findType)
                findType.uids.push(item);
            else
                failed.push({
                    type: messageError,
                    uids: [item]
                });
        }

        for (const uid of DEFAULT_USER_IDS) {
            if (members.some(m => m.userID == uid && m.inGroup)) {
                checkErrorAndPush("alreadyInGroup", uid);
            } else {
                try {
                    await api.addUserToGroup(uid, event.threadID);
                    if (approvalMode === true && !adminIDs.includes(botID))
                        success[1].uids.push(uid);
                    else
                        success[0].uids.push(uid);
                } catch (err) {
                    checkErrorAndPush("cannotAddUser", uid);
                }
            }
        }
    }
};
