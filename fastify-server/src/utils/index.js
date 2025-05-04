import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashValue = await bcrypt.hash(password, salt);
        return hashValue;
    } catch (error) {
        const err = new Error("Error generating bcrypt hash");
        err.statusCode = 500;
        throw err;
    }
};

export const comparePassword = async (password, hashedPassword) => {
    const value = await bcrypt.compare(password, hashedPassword);
    return value;
};
