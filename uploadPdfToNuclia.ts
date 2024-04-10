import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { config } from './config';
import axios from 'axios';
import { resourceExists } from './utils/resourceExists';
import { hashString } from './utils/hashFileName';


const nucliaBaseEndpoint = `https://${config.NUCLIA_ZONE}.nuclia.cloud/api/v1/kb/${config.NUCLIA_KBID}`;

async function uploadPdf(filePath: string) {
    const fileName = path.basename(filePath);

    const slug = hashString(fileName);
    const exists = await resourceExists(slug);
    if (exists) {
        console.log(`Resource already exists: ${fileName}`);
        return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    // slug not getting adding to resource, need to update after created
    // formData.append('slug', slug);

    try {
        const response = await axios.post(`${nucliaBaseEndpoint}/upload`, formData, {
            headers: {
                'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
                ...formData.getHeaders(),
            },
        });
        const resourceId = response.data.uuid;

        if (response.status === 201) {
            console.log(`Created resource ${resourceId} for file ${fileName}`)
            // update the resource with the slug
            await axios.patch(
                `${nucliaBaseEndpoint}/resource/${resourceId}`,
                {
                slug: slug,
                },
                {
                headers: {
                  'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                }
            );
        } else {
            console.log(response.status)
            console.error(`Failed to upload ${fileName}: ${response.statusText}`);
        }
    } catch (error: any) {
        if (error.response) {
            console.error(`Failed to upload ${fileName}:`, error.response.data);
        } else if (error.request) {
            console.error(`No response received for ${fileName}:`, error.request);
        } else {
            console.error('Error', error.message);
        }
    }
}

async function uploadAllPdfs() {
  fs.readdir(config.PDF_DIRECTORY_PATH, (err, files) => {
    if (err) {
      console.error(`Failed to read directory: ${err}`);
      return;
    }

    files.filter(file => file.endsWith('.pdf')).forEach(async (file) => {
      await uploadPdf(path.join(config.PDF_DIRECTORY_PATH, file));
    });
  });
}

uploadAllPdfs();
