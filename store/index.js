import Vuex from 'vuex'
import Cookie from 'js-cookie'
import axios from 'axios'

const createStore = () => {
    return new Vuex.Store({
        state: {
            authKey: null
        },
        getters: {
            isAuth(state){
                return state.authKey != null ? true : false
            },
            getAuthKey(state){
                return state.authKey
            }
        },
        mutations: {
            setAuthKey(state, authKey){
                state.authKey = authKey
            },
            clearAuthKey(state){
                state.authKey = null
                Cookie.remove('authKey')
                Cookie.remove('expiresIn')
                if(process.client){
                    localStorage.removeItem('authKey')
                    localStorage.removeItem('expiresIn')
                }
            }
        },
        actions: {
            nuxtServerInit(vuexContext, context){

            },
            initAuth(vuexContext, req){
                let token
                let expiresIn
                //Server üzerinde çalışıyorsa
                if(req){
                    //Eğer gelen bir cookie yoksa
                    if(!req.headers.cookie){
                        return
                    }
                    //Gelen bir cookie varsa
                    else {
                        token = req.headers.cookie.split('; ').find(c => c.trim().startsWith('authKey'))
                        // Gelen cookie'nin içinde 'authKey' isimli bir cookie varsa bunun değerini token'a eşitliyoruz.
                        if (token){
                           token = token.split('=')[1]
                        }
                        expiresIn = req.headers.cookie.split('; ').find(c => c.trim().startsWith('expiresIn'))
                        // Gelen cookie'nin içinde 'authKey' isimli bir cookie varsa bunun değerini token'a eşitliyoruz.
                        if (expiresIn){
                            expiresIn = expiresIn.split('=')[1]
                        }
                    }
                }
                //Client üzerinde çalışıyorsa
                else {
                    token = localStorage.getItem('authKey')
                    expiresIn = localStorage.getItem('expiresIn')
                }
                //Eğer bir token değeri yoksa veya expire süresi geçmişse 'clearAuthKey' methodunu çalıştır.
                if(new Date().getTime() > +expiresIn || !token){
                    vuexContext.commit('clearAuthKey')
                }
                //Atadığımız 'token' değişkenini 'setAuthKey' methoduyla kullan
                vuexContext.commit('setAuthKey', token)
            },
            login(vuexContext, authData){
                let endpoint
                if(authData.isUser){
                    endpoint = process.env.signinEndPoint
                } else {
                    endpoint = process.env.signupEndPoint
                }
                return axios.post(endpoint + process.env.firebaseAPIKEY, {
                    email: authData.user.email,
                    password: authData.user.password,
                    returnSecureToken: true
                })
                .then((res) => {
                    //Gelen idToken'ın ne zaman geçerliliğinin biteceğini bulmak için. Şuan + expire süresi (milisaniye olarak)
                    let expiresIn = new Date().getTime() + +res.data.expiresIn * 1000
                    Cookie.set('authKey', res.data.idToken)
                    Cookie.set('expiresIn', expiresIn)
                    localStorage.setItem('authKey', res.data.idToken)
                    localStorage.setItem('expiresIn', expiresIn)
                    vuexContext.commit('setAuthKey', res.data.idToken)
                })
            },
            logout(vuexContext){
                vuexContext.commit('clearAuthKey')
            }
        }
    })
}

export default createStore