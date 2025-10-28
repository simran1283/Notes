import { Alert, StyleSheet, View } from "react-native"
import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import { useRoute } from "@react-navigation/native"
import { useState } from "react"
import useEditNote from "../ViewModel/EditNoteViewModel"


const EditNote = () => {

    const route = useRoute()
    const  {item }  = route.params

    const { editNote, setEditNote, onSavePress } = useEditNote(item)

    return(

        <View style={styles.container}>
            <AppTextInput value={editNote} onChangeText={setEditNote} keyboardType="default"/>
            <AppButton title="Save Note" style={{width : "50%"}} onPress={() => onSavePress()}/>
        </View>
    )
}

export default EditNote

const styles = StyleSheet.create({
    container : {
        margin : vs(10)
    }
})