import tokenStore from "src/store/TokenStore";
import { apiInstance } from "./AxiosConfig";


apiInstance.interceptors.request.use(async(config)=>{
    console.log(config.headers)
    return config;
})


