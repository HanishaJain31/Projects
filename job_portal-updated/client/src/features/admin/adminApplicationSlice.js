const initialState = {
    applications: [],
    total: 0,
    isLoading: false,
    error: null
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { viewAllApplications, updateApplicationStatus } from "./adminApplicationApi";

export const fetchAllApplications = createAsyncThunk(
    'adminApplication/fetchAllApplications',
    async (data, { rejectWithValue }) => {
        try {
            const response = await viewAllApplications(data)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateApplicationStatusById = createAsyncThunk(
    'adminApplication/updateApplicationStatusById',
    async ({ application_id, status }, { rejectWithValue }) => {
        try {
            const response = await updateApplicationStatus(application_id, status)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const adminApplicationSlice = createSlice({
    name: 'adminApplication',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllApplications.pending, (state) => {
                state.isLoading = true
                state.error = null
            }
            )
            .addCase(fetchAllApplications.fulfilled, (state, action) => {
                state.isLoading = false
                state.applications = action.payload.data?.applications || []
                state.total = action.payload.data?.total || action.payload.data?.applications?.length || 0
                state.error = null
            }
            )
            .addCase(fetchAllApplications.rejected, (state, action) => {
                state.isLoading = false   
                state.error = action.payload || 'Failed to fetch applications'
            }   
            )
            .addCase(updateApplicationStatusById.pending, (state) => {
                state.isLoading = true
                state.error = null
            }
            )
            .addCase(updateApplicationStatusById.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload?.code !== '1') {
                    state.error = action.payload
                    return
                }
                const { application_id, status } = action.meta.arg
                state.applications = state.applications.map((application) =>
                    application.id === application_id ? { ...application, status } : application
                )
                state.error = null
            }
            )
            .addCase(updateApplicationStatusById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || 'Failed to update application status'
            }
            )
    }
})

export default adminApplicationSlice.reducer
