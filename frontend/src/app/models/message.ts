import { Workshop } from "./workshops";

export class Message {
    _id: string;
    text: string;
    sendUser: string;
    receiveUser: string;
    workshopId: string;
    workshopObj: Workshop;
    createdAt: Date;
    updatedAt: Date;
}