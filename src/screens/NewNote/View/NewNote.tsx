import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import { StyleSheet, View } from "react-native"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import useNewNote from "../ViewModel/NewNoteViewModel"


const NewNote = () => {

    const { note, setNote, AddNotes } = useNewNote()

       return (
        <View style={styles.container}>
            <AppTextInput title="New Note" value={note} onChangeText={setNote} keyboardType="default" />
            <AppButton title="Add" style={{ width: "50%" }} onPress={AddNotes} />
        </View>
    )
}

export default NewNote

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: vs(10)
    }
})