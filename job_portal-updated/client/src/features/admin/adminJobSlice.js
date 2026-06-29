import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createJob as createJobApi, deleteJob, updateJob, viewAllJobs, viewJobById } from "./adminJobApi"

const initialState = {
    jobs: [],
    job: null,
    isLoading: false,
    error: null,
    total: 0
}

export const fetchAllJobs = createAsyncThunk(
    'admin/fetchAllJobs',
    async (data, { rejectWithValue }) => {
        try {
            return await viewAllJobs(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to fetch jobs')
        }
    }
)

export const fetchJobById = createAsyncThunk(
    'admin/fetchJobById',
    async (job_id, { rejectWithValue }) => {
        try {
            return await viewJobById(job_id)
        } catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to fetch job details')
        }
    }
)

export const updateJobById = createAsyncThunk(
    'admin/updateJobById',
    async (data, { rejectWithValue }) => {
        try {
            const { job_id, ...jobData } = data
            return await updateJob(job_id, jobData)
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to update job')
        }
    }
)

export const deleteJobById = createAsyncThunk(
    'admin/deleteJobById',
    async (job_id, { rejectWithValue }) => {
        try {
            return await deleteJob(job_id)
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to delete job')
        }
    }
)

export const createJobByAdmin = createAsyncThunk(
    'admin/createJob',
    async (jobData, { rejectWithValue }) => {
        try {
            await createJobApi(jobData)
            return jobData
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to create job')
        }
    }
)

const adminJobSlice = createSlice({
    name: 'adminJob',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllJobs.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAllJobs.fulfilled, (state, action) => {
                state.isLoading = false
                state.jobs = action.payload.data?.result || []
                state.total = action.payload.data?.total || 0
                state.error = null
            })
            .addCase(fetchAllJobs.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(fetchJobById.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.isLoading = false
                state.job = action.payload.data.result || null
                state.error = null
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(updateJobById.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateJobById.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload?.code !== '1') {
                    state.error = action.payload
                    return
                }
                state.jobs = state.jobs.map((job) => {
                    const jobId = job.job_id || job.id
                    const updatedJob = action.meta.arg
                    return jobId === updatedJob.job_id ? { ...job, ...updatedJob } : job
                })
                state.error = null
            })
            .addCase(updateJobById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(deleteJobById.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteJobById.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload?.code !== '1') {
                    state.error = action.payload
                    return
                }
                state.jobs = state.jobs.filter((job) => {
                    const jobId = job.job_id || job.id
                    return jobId !== action.meta.arg
                })
                state.total = Math.max(0, state.total - 1)
                state.error = null
            })
            .addCase(deleteJobById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(createJobByAdmin.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createJobByAdmin.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload?.code !== '1') {
                    state.error = action.payload
                    return
                }
                state.jobs = [action.meta.arg, ...state.jobs]
                state.total = state.total + 1
                state.error = null
            })
            .addCase(createJobByAdmin.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export default adminJobSlice.reducer
