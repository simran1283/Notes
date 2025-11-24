import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
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
import { RouteProp, useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RootStackParamList } from "../../../types/NavigationType"


const Home = () => {

    const route = useRoute<RouteProp<RootStackParamList,"Home">>()

    const highlightId = route?.params?.id

    const { allNotes, setAllNotes, fetchNotes, handleSync, navigation } = useHome()
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(true)
    const [lastSync, setLastSync] = useState<string | null>("")
    const [highlightedId, setHighlightedId] = useState<string | number | null>(null)
    

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

    useEffect(() => {
        if (highlightId) {
            setHighlightedId(highlightId)
            const timer = setTimeout(() => {
                setHighlightedId(null)
            }, 2500)

            return () => clearTimeout(timer)
        }

    }, [route?.params?.id])

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
        <SafeAreaView style={styles.safeContainer}>
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
                            })
                        }}
                    >
                        <MaterialIcons name="logout" size={ms(22)} color="#df5d88ff" />
                    </TouchableOpacity>
                </View>

                {/* Notes List */}
                <FlatList
                    data={allNotes}
                    renderItem={({ item }) => (
                        <NotesCard
                            item={item}
                            setReload={setReload}
                            highlightId={highlightedId}
                        />
                    )}
                    keyExtractor={(item) => String(item.id)}
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
        </SafeAreaView>
    )
}

export default Home


const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        paddingTop : vs(5)
    },

    container: {
        flex: 1,
        paddingHorizontal: s(15),
        paddingTop : vs(5)
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
        paddingVertical : vs(4),
        paddingHorizontal: s(4),
    },

    syncText: {
        fontSize: ms(13),
        color: "#333",
        flexShrink: 1,
        maxWidth: "80%",
    },

    logoutBtn: {
        padding: s(8),
    },

    listContainer: {
        paddingBottom: vs(90),
        paddingTop: vs(5),
        padding: vs(5)
    },

    addButton: {
        position: "absolute",
        bottom: vs(20),
        right: s(20),
        backgroundColor: "#df5d88ff",
        width: ms(52),
        height: ms(52),
        borderRadius: ms(26),
        alignItems: "center",
        justifyContent: "center",

        // iOS shadow
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,

        // Android elevation
        elevation: .5,
    },
})
