"use strict";
const {
	MessageType,
	Presence
} = require("@adiwajshing/baileys");
const fs = require("fs");

const { getBuffer, sleep } = require("./lib/myfunc");

let setting = JSON.parse(fs.readFileSync('./config.json'));
let { botName } = setting

module.exports = async(iqbl, anj, welcome, left) => {
    const isWelcome = welcome.includes(anj.jid)
    const isLeft = left.includes(anj.jid)
    const mdata = await iqbl.groupMetadata(anj.jid)
    const groupName = mdata.subject

    if (anj.action === 'add'){
        if (anj.participants[0] === iqbl.user.jid){
            await sleep(5000)
            iqbl.updatePresence(anj.jid, Presence.composing)
            iqbl.sendMessage(anj.jid, `Hai aku ${botName}, silahkan kirim #menu`, MessageType.text)
        } else if (isWelcome){
            try {
                var pic = await iqbl.getProfilePicture(anj.participants[0])
            } catch {
                var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
            iqbl.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `Hai @${anj.participants[0].split("@")[0]}, selamat datang di ${groupName}`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
        }
    } else if (anj.action === 'remove' && isLeft){
        try {
            var pic = await iqbl.getProfilePicture(anj.participants[0])
        } catch {
            var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
        }
        iqbl.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `Sayonara @${anj.participants[0].split("@")[0]}`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
    }
}