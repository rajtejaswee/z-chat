import JWT from 'jsonwebtoken';

export const generateToken = (userId, res) => {

    const token = JWT.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        httpOnly: true, // prevents XXS attacks cross-site scripting
        sameSite: 'strict', // prevents CSRF attacks cross-site request forgery
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return token;
}