const admin = require("../models/adminModel");

module.exports = {
  getAllAdmins: (req, res) => {
    admin
      .queryAllAdmins()
      .then((admins) => {
        const totalCount = admins.length;
        res.status(200).json({ data: admins, totalCount: totalCount });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  getAdminById: (req, res) => {
    const adminId = req.params.id;
    admin
      .queryAdminById(adminId)
      .then((result) => {
        if (!result) {
          return res.status(404).send("Admin not found");
        }
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  createAdmin: (req, res) => {
    const newAdmin = req.body;
    admin
      .createAdmin(newAdmin)
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  updateAdmin: (req, res) => {
    const adminId = req.params.id;
    const updatedAdmin = req.body;
    admin
      .updateAdmin(adminId, updatedAdmin)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  deleteAdmin: (req, res) => {
    const adminId = req.params.id;
    admin
      .deleteAdmin(adminId)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },
};
