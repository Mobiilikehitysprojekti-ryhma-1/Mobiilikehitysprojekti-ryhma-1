
export type RootStackParamList = {
    Registration: undefined
    Login: {message: string} | undefined // Viesti-parametri on valinnainen
    AdminLogin: {message: string} | undefined
    ResetPassword: {message: string} | undefined
    UserHome: undefined
    AdminHome: undefined

}
