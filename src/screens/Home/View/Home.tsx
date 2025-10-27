import { FlatList, StyleSheet, View } from "react-native"
import NotesCard from "../../../components/NotesCard/View/NotesCard"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import { useEffect, useState } from "react"
import useHome from "../ViewModel/homeViewModel"


const Home = () => {

    const {allNotes, setAllNotes, navigation, fetchNotes} = useHome()

    const[reload,setReload] = useState(false)

    useEffect(() => {
        const getNotes = async () =>{
            fetchNotes(setAllNotes)
        }

        getNotes()
    }, [reload])

    return (
        <View style={styles.container}>
            <FlatList
                data={allNotes}
                renderItem={({item}) => <NotesCard item={item} setReload = {setReload}/>}
                keyExtractor={(item) => item.id} />
            <AppButton title="Add Note" style={{ width: "30%", alignSelf: "flex-end", marginEnd: vs(10) }}
                onPress={() => navigation.navigate("NewNote")} />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : "center",
        justifyContent : "space-between"
    }
})