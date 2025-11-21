import { Note } from "../components/NotesCard/Model/NotesCardProps";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: {id : string | number};
  NewNote: undefined;
  EditNote : {
    item : Note 
  }
};
