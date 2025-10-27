import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { showMessage } from "react-native-flash-message";
import { vs } from "react-native-size-matters"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import useNotesCard from "../ViewModel/NotesCardViewModel";
import { NotesCardProps } from "../Model/NotesCardProps";
import { FC } from "react";

const NotesCard : FC<NotesCardProps> = ({item, setReload}) => {

  const {deleteNote} = useNotesCard(setReload)

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text>{item.note}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={{color : "white"}}>  Edit  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=> deleteNote(item)}>
                    <Text style={{color : "white"}}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NotesCard

const styles = StyleSheet.create({
    container : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        height : "auto",
        width : "90%",
        margin : vs(10),
        borderRadius : vs(10),
        borderColor : "#9c36b1ff",
        backgroundColor : "#ffffff",
        elevation : 1,
        shadowOffset : {width : vs(20), height : vs(20)},
        shadowOpacity : .7,
        borderWidth : 1,
        padding : vs(6)
    },
    titleContainer : {
        alignItems : "flex-start",
        justifyContent : "center",
        width : "75%"
    },
    buttonsContainer : {
        alignItems : "flex-start",
        justifyContent : "center",
        gap : vs(10)
    },
    button : {
        backgroundColor : "#9c36b1ff",
        padding : vs(5),
        borderRadius : vs(5),
        alignItems:"center",
        justifyContent : "center"
    }
})