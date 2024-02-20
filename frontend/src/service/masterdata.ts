import axios from "axios";

export const getAllItemCategory = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/item-categories');
        return res.data;
    } catch (error) {
        console.error("Error while fetching inventory:", error);
        throw error;
    }
}

export const getAllItemUnit = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/units');
        return res.data;
    } catch (error) {
        console.error("Error while fetching inventory:", error);
        throw error;
    }
}

