const fs = require('fs');
const path = require('path');

const UploadService = {
  uploadFile: async (file) => {
    return new Promise((resolve, reject) => {
      const uploadDir = path.join(__dirname, '../uploads'); // Define your upload directory
      const filePath = path.join(uploadDir, file.originalname);

      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ path: filePath });
        }
      });
    });
  },
};

module.exports = UploadService;
