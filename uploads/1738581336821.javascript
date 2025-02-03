/* [ YTMP4 SUPPORT RESOLUSI ]
* Module : nexo-aio-downloader v1.4.1
* Note : Ga semua video support resolusi tertentu
* Dibuat oleh : https://whatsapp.com/channel/0029Vafqv9YCnA7wYTSDOI3F
*/

const { youtube } = require("nexo-aio-downloader");

async function ytmp4(query, resolution) {
  try {
    const videoInfo = await youtube(query, resolution);
    if (!videoInfo.status) throw new Error("Resolution not found");

    const { title, desc, channel, uploadDate, size, quality, thumb, result } = videoInfo.data;
    const formattedSize = formatBytes(size);

    return {
      title,
      thumb,
      date: uploadDate,
      channel,
      quality,
      contentLength: formattedSize,
      description: desc,
      videoUrl: result,
    };
  } catch (error) {
    throw error;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args || !args[0]) return m.reply(`Contoh : ${usedPrefix + command} link 1\n\n` +
                                        `*List Resolusi:*\n` +
                                        `1: 144p\n` +
                                        `2: 360p\n` +
                                        `3: 480p\n` +
                                        `4: 720p\n` +
                                        `5: 1080p\n` +
                                        `6: 1440p\n` +
                                        `7: 2160p`);

  if (!args[0].match(/youtu/gi)) return m.reply(`Contoh : ${usedPrefix + command} link 1\n\n` +
                                                 `*List Resolusi:*\n` +
                                                 `1: 144p\n` +
                                                 `2: 360p\n` +
                                                 `3: 480p\n` +
                                                 `4: 720p\n` +
                                                 `5: 1080p\n` +
                                                 `6: 1440p\n` +
                                                 `7: 2160p`);

  let v = args[0];
  let res = parseInt(args[1]) || 5;
  if (res < 1 || res > 7) res = 5;

  let resolutions = {
    1: "144p",
    2: "360p",
    3: "480p",
    4: "720p",
    5: "1080p",
    6: "1440p",
    7: "2160p",
  };

  m.reply("Downloading...");

  try {
    const videoData = await ytmp4(v, res);
    const { title, description, channel, thumb, quality, contentLength, videoUrl } = videoData;

    const caption = `*乂 Y T M P 4 - D O W N L O A D E R*\n\n` +
                    `   ◦ Title : ${title}\n` +
                    `   ◦ Author : ${channel}\n` +
                    `   ◦ Resolution : ${resolutions[res]}\n` +
                    `   ◦ Size : ${contentLength}\n` +
                    `   ◦ Description : ${description || ""}`;

    await conn.sendMessage(m.chat, {
      document: videoUrl,
      mimetype: "video/mp4",
      fileName: `${title}.mp4`,
      caption,
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`Terjadi eror: ${e.message}`);
  }
};

handler.help = ["ytmp4"].map((a) => a + ` *youtube url*`);
handler.tags = ["downloader"];
handler.command = ["ytmp4"];

module.exports = handler;