import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native"
import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import { useNavigation, useRoute } from "@react-navigation/native"
import useEditNote from "../ViewModel/EditNoteViewModel"
import Ionicons from "react-native-vector-icons/Ionicons"

const EditNote = () => {

    const route = useRoute()
    const { item } = route.params

    const { editNote, setEditNote, onSavePress, loading } = useEditNote(item)
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <View style={{ alignSelf: "flex-start", marginBottom: vs(30), margin: vs(4) }}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="arrow-back" size={24} color="#df5d88ff" />
                </TouchableOpacity>
            </View>
            <AppTextInput value={editNote} onChangeText={setEditNote} keyboardType="default" />
            <AppButton title={loading ? <ActivityIndicator color="#ffffff"/> : "Save"} style={{ width: "50%", marginTop : vs(10) }} onPress={() => onSavePress()} disabled={loading ? true : false}/>
        </View>
    )
}

export default EditNote

const styles = StyleSheet.create({
    container: {
        margin: vs(10)
    }
})