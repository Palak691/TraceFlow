import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducer/authReducer'
import projectReducer from './reducer/projectReducer'
import taskReducer from './reducer/taskReducer'
import decisionReducer from './reducer/decisionReducer'
import conversationReducer from './reducer/conversationReducer'
import searchReducer from './reducer/searchRuducer'


export const store = configureStore({
    reducer  : {
       auth: authReducer,
       project : projectReducer,
       task : taskReducer,
       decision : decisionReducer,
       conversation : conversationReducer,
       search : searchReducer,
       
    }
});
