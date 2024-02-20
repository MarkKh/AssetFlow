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

export const deleteInventory = async (itemId: number) => {
    try {
        const res = await axios.delete(`http://localhost:7031/api/item/${itemId}`);
        return res.data;
    } catch (error) {
        console.error("Error while deleting inventory:", error);
        throw error;
    }
}
