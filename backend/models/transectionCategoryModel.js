const { pool } = require("../db/db-config");

const transectionCategoryModel = {
  getAllCategories: () => {
    return pool
      .promise()
      .query("SELECT * FROM transection_category")
      .then(([rows]) => rows)
      .catch((error) => {
        console.error("Error getting transection categories:", error);
        throw error;
      });
  },

  getCategoryById: (categoryId) => {
    return pool
      .promise()
      .query("SELECT * FROM transection_category WHERE trans_cat_id = ?", [
        categoryId,
      ])
      .then(([rows]) => rows[0])
      .catch((error) => {
        console.error("Error getting transection category by ID:", error);
        throw error;
      });
  },

  createCategory: (newCategory) => {
    const { trans_cat_name } = newCategory;
    return pool
      .promise()
      .query("INSERT INTO transection_category (trans_cat_name) VALUES (?)", [
        trans_cat_name,
      ])
      .then((result) => ({ id: result.insertId, ...newCategory }))
      .catch((error) => {
        console.error("Error creating transection category:", error);
        throw error;
      });
  },

  updateCategory: (categoryId, updatedCategory) => {
    const { trans_cat_name } = updatedCategory;
    return pool
      .promise()
      .query(
        "UPDATE transection_category SET trans_cat_name = ? WHERE trans_cat_id = ?",
        [trans_cat_name, categoryId]
      )
      .then(() => ({ id: categoryId, ...updatedCategory }))
      .catch((error) => {
        console.error("Error updating transection category:", error);
        throw error;
      });
  },

  deleteCategory: (categoryId) => {
    return pool
      .promise()
      .query("DELETE FROM transection_category WHERE trans_cat_id = ?", [
        categoryId,
      ])
      .then(() => ({
        id: categoryId,
        message: "Transection category deleted successfully",
      }))
      .catch((error) => {
        console.error("Error deleting transection category:", error);
        throw error;
      });
  },
};

module.exports = transectionCategoryModel;
