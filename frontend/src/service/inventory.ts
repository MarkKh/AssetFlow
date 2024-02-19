import axios from "axios";

export const getAllInventory = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/items');
        return res.data;
    } catch (error) {
        console.error("Error while fetching inventory:", error);
        throw error;
    }
}

export const createInventory = async (data: any) => {
    try {
        const res = await axios.post('http://localhost:7031/api/items', data);
        return res.data;
    } catch (error) {
        console.error("Error while posting inventory:", error);
        throw error;
    }
}