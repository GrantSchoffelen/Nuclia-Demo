# Project Title

This project demonstrates how to upload PDF files to Nuclia and create a pipeline to ingest and summarize Wikipedia URLs.

## Prerequisites

You need to have Node.js (version 16.9.0 or above) and npm installed on your machine. If you don't have them installed, you can download them from [here](https://nodejs.org/).

## Installation

1. Clone the repository:
    ```
    git clone <repository-url>
    ```

2. Navigate into the project directory:
    ```
    cd nuclia-demo
    ```

3. Install the dependencies:
    ```
    npm install
    ```

4. Install ts-node globally:
    ```
    npm install -g ts-node
    ```

5. Create a `config.ts` file based on the `config.example.ts` file in the project root.

## Running the Code

This project contains two scripts:

- `uploadPdfToNuclia.ts`: This script reads a local folder and uploads all the PDF files it contains to Nuclia. Run it with the following command:
  ```
  ts-node uploadPdfToNuclia.ts
  ```

- `uploadWikiLinksToNuclia.ts`: This script ingests a list of Wikipedia URLs, triggers a summarize call for each URL, and stores the summary inside the resource at Nuclia. Run it with the following command:
  ```
  ts-node uploadWikiLinksToNuclia.ts
  ```# Nuclia
