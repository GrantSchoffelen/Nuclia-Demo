import axios from 'axios';
import { config } from './config';
import { hashString } from './utils/hashFileName';

const wikipediaLinks = [
  'https://en.wikipedia.org/wiki/Mercury_(planet)',
  'https://en.wikipedia.org/wiki/Venus',
  'https://en.wikipedia.org/wiki/Earth',
  'https://en.wikipedia.org/wiki/Mars',
  'https://en.wikipedia.org/wiki/Jupiter',
  'https://en.wikipedia.org/wiki/Saturn',
  'https://en.wikipedia.org/wiki/Uranus',
  'https://en.wikipedia.org/wiki/Neptune',
  'https://en.wikipedia.org/wiki/Sun',
  'https://en.wikipedia.org/wiki/Moon'
];

const nucliaBaseEndpoint = `https://${config.NUCLIA_ZONE}.nuclia.cloud/api/v1/kb/${config.NUCLIA_KBID}`;
async function createAndSummarizeResources() {
  for (const link of wikipediaLinks) {
    let data = JSON.stringify({
      "slug": hashString(link),
      "links":{
        "link":{
          "uri": link,
          "css_selector":null,
          "xpath":null
        }
      },
      "usermetadata":{
        "classifications":[]
      },
      "title":link,
      "icon":"application/stf-link","origin":{
        "url":link
      }
    });
    
    try {
      // create the resource
      const resource = await axios.post(
        `${nucliaBaseEndpoint}/resources`,
        data,
        {
        headers: {
          'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        }
      );
      const resourceId = resource.data.uuid;
      console.log(`Created resource ${resourceId} for link ${link}`)

      // summarize resource
      const summaryResponse = await axios.post(
        `${nucliaBaseEndpoint}/summarize`,
        {
        resources: [resourceId],
        //error if I don't pass in prompt with link Unfortunately I do not have access to the content behind that link...
        user_prompt: `summarize this wiki article for me please ${link}`
        },
        {
        headers: {
          'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        }
      );

      const summaryData = summaryResponse.data;
      console.log(`Summarize resource ${resourceId} for link ${link}`)

      await axios.patch(
        `${nucliaBaseEndpoint}/resource/${resourceId}`,
        {
        summary: summaryData.resources[resourceId].summary,
        },
        {
        headers: {
          'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        }
      );

      console.log(`resource ${resourceId} updated with summary`)


    } catch (error: any) {
      if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(`Failed to resource with link ${link}:`, error.response.data);
      } else if (error.request) {
          // The request was made but no response was received
          console.error(`No response received for ${link}:`, error.request);
      } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
      }
  }

    

    // // summarize resource
    // const summaryResponse = await axios.post(
    //   `${nucliaBaseEndpoint}/summarize`,
    //   {
    //   resource_id: resourceId,
    //   },
    //   {
    //   headers: {
    //     'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   }
    // );

    // const summaryData = summaryResponse.data;
    // const summary = (summaryData as { summary: string }).summary;

    // // update the resource with the summary
    // await axios.put(
    //   `${nucliaBaseEndpoint}/resource/${slug}`,
    //   {
    //   summary: summary,
    //   },
    //   {
    //   headers: {
    //     'X-NUCLIA-SERVICEACCOUNT': `Bearer ${config.NUCLIA_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   }
    // );
  }
}

createAndSummarizeResources()