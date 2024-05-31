const fs = require('fs');
const path = require('path');

function parseMultipartData(req) {
    return new Promise((resolve, reject) => {
        const contentType = req.headers['content-type'];
        const boundary = `--${contentType.split('boundary=')[1]}`;
        let rawData = [];

        req.on('data', (chunk) => {
            rawData.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(rawData);
            const parts = buffer.toString('binary').split(boundary);
            const result = {
                fields: {},
                files: {}
            };

            parts.forEach(part => {
                if (!part || part === '--\r\n') return;
                const headersEndIndex = part.indexOf("\r\n\r\n");
                if (headersEndIndex === -1) return;

                const headers = part.substring(0, headersEndIndex).trim();
                const content = part.substring(headersEndIndex + 4, part.lastIndexOf("\r\n"));

                const nameMatch = /name="([^"]+)"/.exec(headers);
                const filenameMatch = /filename="([^"]+)"/.exec(headers);
                const contentTypeMatch = /Content-Type: (.+)/.exec(headers);

                if (nameMatch) {
                    const name = nameMatch[1];
                    if (filenameMatch) {
                        const filename = filenameMatch[1];
                        const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
                        const filePath = path.join(__dirname, '..', 'uploads', 'PanImg', filename.replace(/\s/g, '_'));
                        fs.writeFileSync(filePath, Buffer.from(content, 'binary'));
                        result.files[name] = {
                            path: filePath,
                            name: filename,
                            type: contentType,
                            size: Buffer.byteLength(content, 'binary')
                        };
                    } else {
                        result.fields[name] = content.trim();
                    }
                }
            });

            resolve(result);
        });
    });
}

module.exports = parseMultipartData;
