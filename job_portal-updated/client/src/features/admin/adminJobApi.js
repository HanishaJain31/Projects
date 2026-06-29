import api from "../../api/axiosInstance"

export async function viewAllJobs(data) {
    try {
        const response = await api.post('/admin/viewall-jobs', data)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch jobs'
    }
}

export async function viewJobById(job_id) {
    try {
        const response = await api.get(`/admin/viewall-jobs/${job_id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch job details'
    }
}

export async function updateJob(job_id, jobData) {
    try {
        const response = await api.post(`/admin/update-job/${job_id}`, jobData)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to update job'
    }
}

export async function deleteJob(job_id) {
    try {
        const response = await api.delete(`/admin/delete-job/${job_id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to delete job'
    }
}

export async function createJob(jobData) {
    try {
        const response = await api.post('/admin/create-job', jobData)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to create job'
    }
}
