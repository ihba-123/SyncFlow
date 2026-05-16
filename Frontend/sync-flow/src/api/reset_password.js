import api from "./axios_inteceptor";

export const requestResetOtp = async (data) => {
    const res = await api.post("request-otp/", {
        email: data.email,
    });
    return res.data;
};

export const resetPassword = async (data) => {
    const res = await api.post("reset-password/", {
        email: data.email,
        otp: data.otp,
        new_password: data.newPassword,
    });
    return res.data;
};