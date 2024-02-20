const { pool } = require("../db/db-config");

module.exports = {
  queryAllAdmins: () => {
    return pool
      .promise()
      .query("SELECT * FROM admins")
      .then(([results]) => results)
      .catch((err) => console.log(err));
  },

  queryAdminById: (id) => {
    return pool
      .promise()
      .query("SELECT * FROM admins WHERE admin_id = ?", [id])
      .then(([results]) => results[0])
      .catch((err) => console.log(err));
  },

  createAdmin: (admin) => {
    const { admin_name, admin_user, admin_pass } = admin;
    return pool
      .promise()
      .query(
        "INSERT INTO admins (admin_name, admin_user, admin_pass) VALUES (?, ?, ?)",
        [admin_name, admin_user, admin_pass]
      )
      .then(([result]) => {
        return { id: result.insertId, ...admin };
      })
      .catch((err) => console.log(err));
  },

  updateAdmin: (id, admin) => {
    const { admin_name } = admin;
    return pool
      .promise()
      .query(
        "UPDATE admins SET admin_name = ? WHERE admin_id = ?",
        [admin_name, id]
      )
      .then(() => {
        return { id, admin_name };
      })
      .catch((err) => console.log(err));
},

  deleteAdmin: (id) => {
    return pool
      .promise()
      .query("DELETE FROM admins WHERE admin_id = ?", [id])
      .then(() => {
        return { message: 'Admin deleted successfully.' };
      })
      .catch((err) => console.log(err));
  },
};
