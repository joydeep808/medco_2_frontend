import {MMKV} from "react-native-mmkv"


class TokenStore{

    private mmkv:MMKV; 
    constructor(){
        this.mmkv = new MMKV()
    }
    setToken(key:string , value:string){
        this.mmkv.set(key,value)
    }
    getAccessToken(){
        return this.mmkv.getString("access_token")
    }
    getRefreshToken(){
        return this.mmkv.getString("refresh_token")
    }
    getKey(key:string){
        return this.mmkv.getString(key)
    }
}

const tokenStore = new TokenStore();

export default tokenStore;