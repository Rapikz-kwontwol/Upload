import uploadImage from '../lib/uploadImage.js'
const baileys = (await import("@adiwajshing/baileys")).default;
if (!baileys.proto.Message.ProtocolMessage.Type.STATUS_MENTION_MESSAGE) {
  throw new Error("no STATUS_MENTION_MESSAGE found in ProtocolMessage (is your WAProto up-to-date?)");
}

// Function to fetch participants of groups
const fetchParticipants = async (...jids) => {
  let results = [];
  for (const jid of jids) {
    let { participants } = await conn.groupMetadata(jid);
    participants = participants.map(({ id }) => id);
    results = results.concat(participants);
  }
  return results;
};

async function mentionStatus(jids, content) {
    let colors = ['#7ACAA7', '#6E257E', '#5796FF', '#7E90A4', '#736769', '#57C9FF', '#25C3DC', '#FF7B6C', '#55C265', '#FF898B', '#8C6991', '#C69FCC', '#B8B226', '#EFB32F', '#AD8774', '#792139', '#C1A03F', '#8FA842', '#A52C71', '#8394CA', '#243640'];
    let fonts = [0, 1, 2, 6, 7, 8, 9, 10];

    let users = [];
    for (let id of jids) {
        let userId = await conn.groupMetadata(id);
        users.push(...userId.participants.map(u => conn.decodeJid(u.id)));
    }

    let message = await conn.sendMessage(
        "status@broadcast", 
        content, 
        {
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            font: fonts[Math.floor(Math.random() * fonts.length)],
            statusJidList: users,
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: jids.map((jid) => ({
                                tag: "to",
                                attrs: { jid },
                                content: undefined,
                            })),
                        },
                    ],
                },
            ],
        }
    );

    jids.forEach(id => {
        conn.relayMessage(
            id, 
            {
                groupStatusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: message.key,
                            type: 25,
                        },
                    },
                },
            },
            {
                userJid: conn.user.jid,
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "true" },
                        content: undefined,
                    },
                ],
            }
        );
    });
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command == 'upswimage') {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'No media found'
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await uploadImage(media)
  await mentionStatus([m.chat], {
  image: {
    url: `${link}`
  },
  caption: `${text}`
});
}
if (command == 'upswvideo') {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'No media found'
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await uploadImage(media)
  await mentionStatus([m.chat], {
  video: {
    url: `${link}`
  },
  caption: `${text}`
});
}
if (command == 'upswaudio') {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'No media found'
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await uploadImage(media)
  await mentionStatus([m.chat], {
  audio: {
    url: `${link}`
  },
});
}
if (command == 'upswtext') {
  let anu = `${text}`
  await mentionStatus([m.chat], {
  text: anu
});
}
if (command == 'upsw') {
  let anu = `MAU YANG MANA?
.upswimage < caption/no caption > ( untuk foto )
.upswvideo < caption/no caption > ( untuk video )
.upswaudio ( untuk audio )
.upswtext < caption > ( untuk text )`
  m.reply(anu);
}
}
handler.help = ['upswimage','upswvideo','upswtext','upswaudio','upsw']
handler.tags = ['owner']
handler.command = /^(upswimage|upswvideo|upswtext|upswaudio|upsw)$/i
handler.owner = true
export default handler