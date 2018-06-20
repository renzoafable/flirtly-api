const queries = {
  requestConnection: `
    INSERT INTO pending_connections (
      senderID,
      senderName,
      receiverID,
      receiverName,
      confirmed,
      dateAdded
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      true,
      NOW()
    )
  `,
  getPendingConnectionOfUsers: `
    SELECT * FROM pending_connections WHERE senderID=? AND receiverID=?
  `,
  getSentConnections: `
    SELECT * FROM pending_connections WHERE senderID=?
  `,
  getReceivedConnections: `
    SELECT * FROM pending_connections WHERE receiverID=?
  `
};

module.exports = queries;