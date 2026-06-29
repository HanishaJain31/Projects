import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { appliedJobs, userDashboard } from "./userProfileApi"

const initialState = {
    applications: [],
    dashboardData: {},
    isLoading: false,
    error: null,
}

export const jobsApplied = createAsyncThunk(
    'profile/appliedJobs',
    async (_, { rejectWithValue }) => {
        try {
            return await appliedJobs();
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch applied jobs")
        }
    }
)

export const dashboardData = createAsyncThunk(
    'profile/dashboardData',
    async (_, { rejectWithValue }) => {
        try {
            return await userDashboard();
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch dashboard data")
        }
    }
)

const userProfile = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(jobsApplied.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(jobsApplied.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false
                state.applications = Array.isArray(action.payload.data) ? action.payload.data : []
                state.error = null
            })
            .addCase(jobsApplied.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(dashboardData.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(dashboardData.fulfilled, (state, action) => {
                state.isLoading = false
                state.dashboardData = action.payload.data?.result?.[0] || {}
                state.error = null
            })
            .addCase(dashboardData.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export default userProfile.reducer
