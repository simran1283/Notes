import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import useNewNote from "../ViewModel/NewNoteViewModel"
import Ionicons from "react-native-vector-icons/Ionicons"

const NewNote = () => {

    const { note, setNote, AddNotes, navigation, loading } = useNewNote()

    return (
        <View style={styles.container}>
            <View style={{ alignSelf: "flex-start", marginBottom: vs(30), margin: vs(4) }}>
                <TouchableOpacity onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Home" }],
                    });
                }}>
                    <Ionicons name="arrow-back" size={24} color="#df5d88ff" />
                </TouchableOpacity>
            </View>
            <AppTextInput title="New Note" value={note} onChangeText={setNote} keyboardType="default" />
            <AppButton title={loading ? <ActivityIndicator color="#ffffff" /> : "Add"}
                style={{ width: "50%", marginTop: vs(10) }}
                onPress={AddNotes}
                disabled={loading ? true : false} />
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