export interface NotesCardProps {
    item : Note
} 


export type Note  = {
    id : string,
    note : string,
    lastUpdated : number,
    userId : string,
    localId? : string,
    sync? : number
}