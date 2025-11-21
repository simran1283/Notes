import DatePicker from "react-native-date-picker"
import useCalendar from "../../../context/CalendarContext"
import { useIsFocused } from "@react-navigation/native"
import useNotesCard from "../../NotesCard/ViewModel/NotesCardViewModel"
import { updatesetReminder } from "../../../database/databse"
import { useState } from "react"
import { showMessage } from "react-native-flash-message"
import { scheduledNotification } from "../../../notifications/scheduledNotification"

const Calendar = () => {

    const { isOpen, setOpen, cancelAction, selectedNote, setReload } = useCalendar()
    const { onToggleCheck } = useNotesCard(setReload)
    const [date, setDate] = useState(new Date())

    console.log("Calendar Mounted")
    const isFocused = useIsFocused(); // used because this component was mounting before home screen and was creating error

    if (!isFocused) return null;

    return (
        <DatePicker
            modal
            open={isOpen}
            date={date}
            mode="datetime"
            onConfirm={async (value) => {
                setOpen(false)
                if (value < new Date()) {
                    showMessage({
                        type: "danger",
                        message: "Can't set reminder for past time"
                    })
                    return;
                } else {
                    setDate(value)
                    await updatesetReminder(selectedNote?.localId, selectedNote?.id, value.getTime())
                    onToggleCheck()
                    await scheduledNotification(value, selectedNote)
                    setReload?.(prev => !prev);
                }

            }}
            onCancel={() => {
                setOpen(false)
                cancelAction?.()
            }} />
    )
}

export default Calendar