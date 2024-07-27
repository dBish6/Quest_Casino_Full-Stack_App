/**
 * The room for communication between two friends.
 */
const getFriendRoom = (userVerToken: string, friendVerToken: string) =>
    [userVerToken, friendVerToken].sort().join("_");

export default getFriendRoom;