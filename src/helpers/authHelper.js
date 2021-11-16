import { genSalt, hash, compare } from "bcrypt";

export const hashPassword = async (password) => {
    const salt = await genSalt(15);
    return await hash(password, salt);
};

export const verifyPassword = async (password, originalPassword) => {
    return await compare(password, originalPassword);
};
