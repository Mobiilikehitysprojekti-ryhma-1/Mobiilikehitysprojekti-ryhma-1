
export type LoginStackParamList = {
    Registration: undefined
    Login: {message: string} | undefined // Tässä viesti-parametri on valinnainen
    AdminLogin: {message: string} | undefined
    ResetPassword: {message: string} | undefined
}

export type UserStackParamList = {
    UserHome: undefined;
};

export type AdminStackParamList = {
    AdminHome: undefined;
    MealSchedule: undefined;
    MedSchedule: undefined;
    LocationSettings: undefined;
};