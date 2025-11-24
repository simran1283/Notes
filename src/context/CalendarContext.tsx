import React, { createContext, ReactNode, useContext, useState } from "react";
import { LocalNote } from "../database/databse";
import { CalendarContextType } from "../types/CalendarContextType";

const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider : React.FC<{children : ReactNode}> = ({ children }) => {

  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<LocalNote | null>(null)
  const [cancelAction, setCancelAction] = useState<null | (() => void)>(null)
  const [setReload, setSetReload] = useState<(() => void) | null>(null);


  return (
    <CalendarContext.Provider value={{ isOpen, setOpen, cancelAction, setCancelAction, selectedNote, setSelectedNote,setReload,
      setSetReload  }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error("useCalendar must be used inside CalendarProvider");
  }
  return context;
}
