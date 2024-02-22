import axios from "axios";

export const getAllITransaction = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/transections');
        return res.data;
    } catch (error) {
        console.error("Error while fetching:", error);
        throw error;
    }
}