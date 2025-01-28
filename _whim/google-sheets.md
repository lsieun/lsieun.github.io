---
title: "Google Sheets"
sequence: "101"
---

## Basic

- Google Project: MyFirstProject
- Project Id: myfirstproject-417014
- Project Number: 158304052828

## Set up your environment

### Enable the API

```text
Google Cloud project --> turn on Google Sheets API
```

### Authorize credentials for a desktop application

- credentials.json

## Prepare the workspace

```xml

<dependencies>
    <dependency>
        <groupId>com.google.api-client</groupId>
        <artifactId>google-api-client</artifactId>
        <version>2.0.0</version>
    </dependency>
    <dependency>
        <groupId>com.google.oauth-client</groupId>
        <artifactId>google-oauth-client-jetty</artifactId>
        <version>1.34.1</version>
    </dependency>
    <dependency>
        <groupId>com.google.apis</groupId>
        <artifactId>google-api-services-sheets</artifactId>
        <version>v4-rev20220927-2.0.0</version>
    </dependency>
</dependencies>
```

## MindMap

```text
credentials.json --> Credential --> Sheets(Service)
```

## Reference

- [Google Sheets API Overview](https://developers.google.com/sheets/api/guides/concepts#a1_notation)
- [Google Sheets - Java quickstart](https://developers.google.com/sheets/api/quickstart/java)
- [Interact with Google Sheets from Java](https://www.baeldung.com/google-sheets-java-client)

- SomeSheets
  - [Example Spreadsheet](https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0)
