export interface NotesCardProps {
    item: Note,
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
    highlightId: string | number
}


export type Note = {
    id: string,
    note: string,
    lastUpdated: number,
    userId?: string,
    localId?: string,
    sync?: number,
    reminder: string
}