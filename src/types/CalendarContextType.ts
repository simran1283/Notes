import { LocalNote } from "../database/databse";

export type CalendarContextType = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNote: LocalNote | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<LocalNote | null>>;
  cancelAction: (() => void) | null;
  setCancelAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  setReload: (() => void) | null;
  setSetReload: React.Dispatch<React.SetStateAction<(() => void) | null>>;
};
