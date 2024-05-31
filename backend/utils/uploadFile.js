const fs = require('fs');
const path = require('path');
/**
 * Parses multipart data and saves uploaded files.
 * @param {IncomingMessage} req - The HTTP incoming request object.
 * @param {string} uploadDir - Directory to save uploaded files.
 * @returns {Promise<Object>} - A promise that resolves with the filename and path.
 */
function saveUploadedFile(req, uploadDir) {
    return new Promise((resolve, reject) => {
        const contentType = req.headers['content-type'];
        const boundary = `--${contentType.split('=')[1]}`;
        let lastPartIndex = -1;
        let rawData = [];

        req.on('data', (chunk) => {
            rawData.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(rawData);
            let position = 0;
            while ((lastPartIndex = buffer.indexOf(boundary, position)) !== -1) {
                let endPosition = buffer.indexOf(boundary, lastPartIndex + boundary.length);
                if (endPosition === -1) break; // No end boundary found, stop processing
                let part = buffer.slice(lastPartIndex + boundary.length, endPosition);
                let headersEndIndex = part.indexOf('\r\n\r\n');

                if (headersEndIndex !== -1) {
                    let header = part.slice(0, headersEndIndex).toString();
                    let body = part.slice(headersEndIndex + 4, part.length - 2); // Skip the trailing CRLF
                    if (header.indexOf('filename="') !== -1) {
                        const filenameMatch = /filename="([^"]+)"/.exec(header);
                        const contentTypeMatch = /Content-Type: (.+)/.exec(header);
                        if (!filenameMatch) continue;

                        const filename = filenameMatch[1];
                        const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
                        const fullPath = path.join(uploadDir, filename);

                        fs.writeFile(fullPath, body, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    fieldname: header.match(/name="([^"]+)"/)[1],
                                    originalFilename: filename,
                                    contentType,
                                    size: body.length,
                                    path: fullPath
                                });
                            }  
                        }
                        
                    
                    );
                        break;
                    }
                }
                position = endPosition + boundary.length;
            }
        });
    });
}

function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

module.exports = { saveUploadedFile, deleteFile };
