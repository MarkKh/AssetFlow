import axios from "axios";

export const getAllItemCategory = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/item-categories');
        return res.data;
    } catch (error) {
        console.error("Error while fetching:", error);
        throw error;
    }
}

export const createItemCategory = async (data: any) => {
    try {
        const res = await axios.post('http://localhost:7031/api/item-categories', data);
        return res.data;
    } catch (error) {
        console.error("Error while posting item category:", error);
        throw error;
    }
}

export const deleteItemCategory = async (id: number) => {
    try {
        const res = await axios.delete(`http://localhost:7031/api/item-categorie/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error while deleting item category:", error);
        throw error;
    }
}

export const updateItemCategory = async (id: number, data: any) => {
    try {
        const res = await axios.put(`http://localhost:7031/api/item-categorie/${id}`, data);
        return res.data;
    } catch (error) {
        console.error("Error while updating item category:", error);
        throw error;
    }
}
