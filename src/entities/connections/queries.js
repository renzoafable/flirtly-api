const queries = {
  requestConnection: `
    INSERT INTO connections (
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
      ?,
      NOW()
    )
  `,
  getConnections: `
    SELECT * FROM connections WHERE senderID=? AND confirmed=1
  `,
  getPendingConnectionOfUsers: `
    SELECT * FROM connections WHERE senderID=? AND receiverID=? AND confirmed=0
  `,
  getSentConnections: `
    SELECT * FROM connections WHERE senderID=?
  `,
  getReceivedConnections: `
    SELECT * FROM connections WHERE receiverID=?
  `,
  approveReceivedConnections: `
    UPDATE connections
    SET 
      confirmed=TRUE
    WHERE
      senderID=? AND receiverID=?
  `,
};

module.exports = queries;