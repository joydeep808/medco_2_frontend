import tokenStore from "src/store/TokenStore";
import { apiInstance } from "./AxiosConfig";


// i have to validate the token before making anything like 

apiInstance.interceptors.request.use(async(config)=>{
    const token  = tokenStore.getAccessToken()
    config.headers.Authorization = `Bearer ${token}`
    return config;
})


