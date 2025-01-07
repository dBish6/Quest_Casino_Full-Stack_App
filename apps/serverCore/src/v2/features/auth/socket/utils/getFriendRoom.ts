/**
 * The room for communication between two friends.
 */
const getFriendRoom = (userMemberId: string, friendMemberId: string) =>
    [userMemberId, friendMemberId].sort().join("_");

export default getFriendRoom;