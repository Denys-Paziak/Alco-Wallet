import axios from "axios";

const host = "https://alco-wallet.vercel.app";

export const getBalance = async () => {
    try {
        const response = await axios.get(`${host}/USDT/balance`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при отриманні балансу:", error);
        throw error;
    }
}

export const getTRDBalance = async () => {
    try {
        const response = await axios.get(`${host}/TRD/balance`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при отриманні балансу:", error);
        throw error;
    }
}

export const getListUserCrypto = async () => {
    try {
        const response = await axios.get(`${host}/crypto/balance`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при отриманні списку користувачів криптовалют:", error);
        throw error;
    }
}

export const getListCrypto = async () => {
    try {
        const response = await axios.get(`${host}/crypto/market`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при отриманні списку криптовалют:", error);
        throw error;
    }
}

export const getStakingCrypto = async () => {
    try {
        const response = await axios.get(`${host}/crypto/staking`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при отриманні списку криптовалют:", error);
        throw error;
    }
}

export const getUserStaking = async () => {
    try {
        const response = await axios.get(`${host}/user/staking`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при отриманні списку користувачів криптовалют:", error);
        throw error;
    }
}

export const buyCrypto = async (name, total) => {
    try {
        const response = await axios.patch(`${host}/buy`, { name, total });
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при покупці криптовалюти:", error);
        throw error;
    }
}

export const buyUSD = async (total) => {
    try {
        const response = await axios.patch(`${host}/USDT/replenish`, { total });
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при покупці криптовалюти:", error);
        throw error;
    }
}

export const convertCrypto = async (fromCrypto, toCrypto, total) => {
    try {
        const response = await axios.patch(`${host}/crypto/convert`, { fromCrypto, toCrypto, total });
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при конвертації криптовалюти:", error);
        throw error;
    }
}

export const stakingCrypto = async (name, total, validator) => {
    try {
        const response = await axios.patch(`${host}/staking`, { name, total, validator });
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при конвертації криптовалюти:", error);
        throw error;
    }
}

export const unStakingCrypto = async (name) => {
    try {
        const response = await axios.delete(`${host}/unstaking?name=${name}`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при конвертації криптовалюти:", error);
        throw error;
    }
}

export const getСhart = async (crypto) => {
    try {
        const response = await axios.get(`${host}/crypto/allChart?name=${crypto}`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при полученні даних з графіка:", error);
        throw error;
    }
}

export const getSevenDaysСhart = async () => {
    try {
        const response = await axios.get(`${host}/crypto/sevenDaysChart`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при полученні даних графіків за сім днів:", error);
        throw error;
    }
}

export const getHistory = async () => {
    try {
        const response = await axios.get(`${host}/user/history`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при полученні даних історії:", error);
        throw error;
    }
}

export const createDeposit = async (name, total, period) => {
    try {
        const response = await axios.patch(`${host}/deposit`, { name, total, period });
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при конвертації криптовалюти:", error);
        throw error;
    }
}

export const getUserDeposit = async () => {
    try {
        const response = await axios.get(`${host}/user/deposit`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при отриманні списку користувачів криптовалют:", error);
        throw error;
    }
}

export const unDeposit = async (name) => {
    try {
        const response = await axios.delete(`${host}/undeposit?name=${name}`);
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при конвертації криптовалюти:", error);
        throw error;
    }
}

export const send = async (name, total, addresses) => {
    try {
        const response = await axios.patch(`${host}/crypto/send`, { name, total, addresses });
        return response.data;
    } catch (error) {
        // Обробка помилки
        console.error("Помилка при надсиланні криптовалюти:", error);
        throw error;
    }
}