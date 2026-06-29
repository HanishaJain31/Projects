import axios from "axios";
import {
 encryptData,
 decryptData
} from "./crypto";


const api = axios.create({
baseURL:
import.meta.env.VITE_API_URL
});



// before request

api.interceptors.request.use(

    (config)=>{
        config.headers["api-key"] = import.meta.env.VITE_API_KEY;

        const token =
        localStorage.getItem("token");

        if(token){
            config.headers.token =
            `Bearer ${token}`;
        }
        if(config.data && !(config.data instanceof FormData)){
            config.data =
            encryptData(config.data);
        }

    return config;
});




// response decrypt

api.interceptors.response.use(

  (response) => {

    if (typeof response.data === "string") {
      response.data = decryptData(response.data);
    }

    return response;
  },

  (error) => {

    if (
      error.response &&
      typeof error.response.data === "string"
    ) {
      error.response.data =
        decryptData(error.response.data);
    }

    return Promise.reject(error);
  }

);



export default api;
