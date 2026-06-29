import api from "../../api/axiosInstance";

export async function appliedJobs(data){
    const response = await api.get(`/user/applied-jobs`, data)
    return response.data;
}

export async function userDashboard(data){
    const response = await api.get(`/user/dashboard`, data)
    return response.data;
}