import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlice'
import jobReducer from './user/jobSlice'
import userProfile from './user/userProfileSlice'
import adminProfile from './admin/adminProfileSlice'
import adminJob from './admin/adminJobSlice'
import adminUser from './admin/adminUserSlice'
import adminApplication from './admin/adminApplicationSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobReducer,
        profile: userProfile,
        adminProfile: adminProfile,
        adminJob: adminJob,
        adminUser: adminUser,
        adminApplication: adminApplication,
    }
})

