import axios from "axios";
import { config } from "../config";

const nucliaBaseEndpoint = `https://${config.NUCLIA_ZONE}.nuclia.cloud/api/v1/kb/${config.NUCLIA_KBID}`;

// check if a resource exists by slug
export async function resourceExists(slug: string): Promise<boolean> { 
    try {
        const response = await axios.get(`${nucliaBaseEndpoint}/slug/${slug}`, {
            headers: { 
                'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
            },
        });
        return response.status === 200;
    } catch (error) {
        console.error(`resource not found: ${error}`);
        return false;
    }
}