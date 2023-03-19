// User type: 0 - Participant, 1 - Organizer, 2 - Administrator
export enum UserType {
    Participant = 0,
    Organizer = 1,
    Admin = 2,
}

// User status: 0 - Pending, 1 - Approved, 2 - Rejected
export enum UserStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export class User {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    tel: string;
    email: string;
    type: UserType;
    profileImage: string;
    organizationName: string;
    organizationAddress: string;
    organizationID: string;
    status: UserStatus;
}