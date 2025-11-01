import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import NotesCard from "../../../components/NotesCard/View/NotesCard"
import NetInfo from "@react-native-community/netinfo"
import { vs } from "react-native-size-matters"
import { useEffect, useState } from "react"
import useHome from "../ViewModel/homeViewModel"
import Ionicons from "react-native-vector-icons/Ionicons"
import EmptyNotes from "../../../components/EmptyNotes/View/EmptyNotes"
import { showMessage } from "react-native-flash-message"
import { useNavigation} from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Home = () => {

    const { allNotes, setAllNotes, fetchNotes, handleSync, isSyncingIn } = useHome()

    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastSync, setLastSync] = useState("")

    const navigation = useNavigation()


    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                handleSync()
            }
        })
        return () => unsubscribe()
    }, [])



    useEffect(() => {
        const getNotes = async () => {
            try {
                setLoading(true)
                await fetchNotes(setAllNotes)
                const lastSyncTime = await AsyncStorage.getItem('lastSync')
                setLastSync(lastSyncTime)

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




    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#df5d88ff" />
            </View>
        )
    }


    if (allNotes.length == 0) {
        return (
            <EmptyNotes />
        )
    }
    console.log("In home screen ")


    return (

        <View style={styles.container}>
            <View style={{ alignSelf: "flex-start", margin: vs(10), marginBottom: vs(5) }}>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                    <Ionicons name="arrow-back" size={24} color="#df5d88ff" />
                </TouchableOpacity>
            </View>

            {
                isSyncingIn ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={"large"} color="#df5d88ff" />
                        <Text style={{ fontSize: vs(15), color: "grey" }}>Syncing in Progress......</Text>
                    </View> :
                    <>
                        <Text style={{ color: "#000000" }}>Last Synced : {lastSync}</Text>
                        <FlatList
                            data={allNotes}
                            renderItem={({ item }) => <NotesCard item={item} setReload={setReload} />}
                            keyExtractor={(item) => item.id} />
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("NewNote")}>
                            <Ionicons name="add" color="#ffffff" size={24} />
                        </TouchableOpacity>
                    </>
            }

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