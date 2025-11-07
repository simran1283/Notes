import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"
import NotesCard from "../../../components/NotesCard/View/NotesCard"
import NetInfo from "@react-native-community/netinfo"
import { ms, vs, s } from "react-native-size-matters"
import { useEffect, useState } from "react"
import useHome from "../ViewModel/homeViewModel"
import Ionicons from "react-native-vector-icons/Ionicons"
import EmptyNotes from "../../../components/EmptyNotes/View/EmptyNotes"
import { showMessage } from "react-native-flash-message"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const Home = () => {

    const { allNotes, setAllNotes, fetchNotes, handleSync } = useHome()
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(true)
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
                const lastSyncTime = await AsyncStorage.getItem("lastSync")
                setLastSync(lastSyncTime)
            } catch (error) {
                showMessage({
                    type: "danger",
                    message: "Error fetching notes",
                })
            } finally {
                setLoading(false)
            }
        }
        getNotes()
    }, [reload])

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#df5d88ff" />
            </View>
        )
    }

    if (allNotes.length === 0) {
        return <EmptyNotes />
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.syncText}>
                    Last Synced: {lastSync || "Not yet synced"}
                </Text>
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={async () => {
                        await AsyncStorage.removeItem("user")
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "SignIn" }],
                        });
                    }}
                >
                    <MaterialIcons name="logout" size={ms(22)} color="#df5d88ff" />
                </TouchableOpacity>
            </View>

            {/* Notes List */}
            <FlatList
                data={allNotes}
                renderItem={({ item }) => <NotesCard item={item} setReload={setReload} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            {/* Add Note Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("NewNote")}
            >
                <Ionicons name="add" color="#fff" size={ms(26)} />
            </TouchableOpacity>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: s(15),
        paddingTop: vs(10),
    },

    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: vs(10),
        paddingVertical: vs(5),
    },

    syncText: {
        fontSize: ms(13),
        color: "#333",
        flexShrink: 1,
    },

    logoutBtn: {
        padding: s(6),
    },

    listContainer: {
        paddingBottom: vs(60), // space for floating button
    },

    addButton: {
        position: "absolute",
        bottom: vs(20),
        right: s(20),
        backgroundColor: "#df5d88ff",
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 5,
    },
})
