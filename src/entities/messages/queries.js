const queries = {
  getMessages: `
    SELECT * FROM messages WHERE (senderID=? OR receiverID=?)
  `,
  getSentMessages: `
    SELECT * FROM messages WHERE senderID=?
  `,
  getReceivedMessages: `
    SELECT * FROM messages WHERE receiverID=?
  `,
  sendMessage: `
    CALL sendMessage(?,?,?)
  `,
  getChats: `
    CALL getChats(?,?)
  `,
};

module.exports = queries;