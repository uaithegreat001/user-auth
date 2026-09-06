
// Cookies configurations
export const setCookies =  {
    httpOnly: true,
    //secure: process.env.NODE_ENV,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
}

// Refresh token cookies
export const setRefreshCookies = {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

