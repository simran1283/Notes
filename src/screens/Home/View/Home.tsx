import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import NotesCard from "../../../components/NotesCard/View/NotesCard"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import { useEffect, useState } from "react"
import useHome from "../ViewModel/homeViewModel"
import Ionicons from "react-native-vector-icons/Ionicons"
import EmptyNotes from "../../../components/EmptyNotes/View/EmptyNotes"
import { showMessage } from "react-native-flash-message"

const Home = () => {

    const { allNotes, setAllNotes, navigation, fetchNotes } = useHome()

    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getNotes = async () => {
            try {
                setLoading(true)
                await fetchNotes(setAllNotes)
            } catch (error) {
                showMessage({
                    type: "danger",
                    message: error
                })
            }
            finally {
                setLoading(false)
            }
        }

        getNotes()
    }, [reload])

    if(loading){
        return(
            <View style={{flex : 1, alignItems : "center", justifyContent : "center"}}>
                <ActivityIndicator size="large" color="#df5d88ff"/>
            </View>
        )
    }


    if (allNotes.length == 0) {
        return (
            <EmptyNotes />
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ alignSelf: "flex-start", margin: vs(10) }}>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                    <Ionicons name="arrow-back" size={24} color="#df5d88ff" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={allNotes}
                renderItem={({ item }) => <NotesCard item={item} setReload={setReload} />}
                keyExtractor={(item) => item.id} />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("NewNote")}>
                <Ionicons name="add" color="#ffffff" size={24} />
            </TouchableOpacity>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        backgroundColor: "#df5d88ff",
        padding: vs(5),
        borderRadius: vs(5),
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
        marginHorizontal: vs(20),
        marginVertical: vs(10)
    }
})