import { Note } from "../components/NotesCard/Model/NotesCardProps";


export type CalendarContextType = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNote: Note | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  cancelAction: (() => void) | null;
  setCancelAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  setReload?: React.Dispatch<React.SetStateAction<boolean>> | null;
  setSetReload: React.Dispatch<React.SetStateAction<(() => void) | null>>;
};
