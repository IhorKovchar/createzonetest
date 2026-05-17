export interface IFriendshipButton {
    friendshipId: number,
    action: "ACCEPT" | "REJECT"
    label: string
}