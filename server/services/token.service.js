import { createRefreshJwToken } from "../model/user.js";

export const refreshJwTokenService = async (userId, refreshJwToken) => {
    const sevenDaysInMinutes = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now()) + sevenDaysInMinutes;
    return await createRefreshJwToken({
        userId: userId,
        token: refreshJwToken,
        expiresAt: expiresAt
    });
}
