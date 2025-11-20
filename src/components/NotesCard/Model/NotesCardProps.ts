export interface NotesCardProps {
    item : Note,
    setReload : boolean
    highlightId : boolean
} 


export type Note  = {
    id : string,
    note : string,
    lastUpdated : number,
    userId : string,
    localId? : string,
    sync? : number,
    reminder : string
}