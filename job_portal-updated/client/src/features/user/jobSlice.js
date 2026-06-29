import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { applyForJob, viewAllJobs, viewJobById } from "./jobApi"


const initialState = {
    jobs: [],
    jobDetails: null,
    jobApplication: null,
    isLoading: false,
    error: null,
    total: 0
}

export const viewJobs = createAsyncThunk(
    'jobs/viewAllJobs',
    async (data, { rejectWithValue }) => {
        try {
            return await viewAllJobs(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch jobs")
        }
    }
)

export const viewJobDetails = createAsyncThunk(
    'jobs/viewAllJobs/:id',
    async (id, { rejectWithValue }) => {
        try {   
            return await viewJobById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch job details")
        }
    }
)

export const applyJob = createAsyncThunk(
    'jobs/applyForJob',
    async (formData, { rejectWithValue }) => {
        try {
            return await applyForJob(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to apply for job")
        }
    }
)

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(viewJobs.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(viewJobs.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false
                state.jobs = action.payload.data?.result || []
                state.total = action.payload.data?.totalRecords || 0
            })
            .addCase(viewJobs.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(viewJobDetails.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(viewJobDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.jobDetails = action.payload.data
                state.error = null
                // Handle job details in state if needed
            })
            .addCase(viewJobDetails.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(applyJob.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(applyJob.fulfilled, (state, action) => {
                state.isLoading = false
                state.jobApplication = action.payload.data
                state.error = null
            })
            .addCase(applyJob.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export default jobSlice.reducer
