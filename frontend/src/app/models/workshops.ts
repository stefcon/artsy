export class Workshop {
    _id: string;
    name: string;
    organizer: string;
    approved: number;
    date: Date;
    address: string;
    seats: number;
    description: string;
    shortDesc: string;
    longDesc: string;
    likedBy: Array<string>;
    comments: Array<string>;
    pictures: Array<string>;
    signedUp: Array<string>;
    waitlist: Array<string>;
    emailList: Array<string>;
    possible: boolean;
}