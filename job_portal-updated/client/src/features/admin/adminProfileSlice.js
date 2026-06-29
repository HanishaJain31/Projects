import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { dashboardStats } from './adminProfileApi'

const initialState = {
    dashboardStats: {},
    isLoading: false,
    error: null,
}

export const fetchDashboardStats = createAsyncThunk(
    'admin/dashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            return await dashboardStats()
        } catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to fetch dashboard stats')
        }
    }
)

const adminProfile = createSlice({
    name: 'adminProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false
                state.dashboardStats = action.payload.data?.[0] || {}
                state.error = null
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export default adminProfile.reducer
