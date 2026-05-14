# BigQuery Node samples and the go-googlesql emulator

When **`BIGQUERY_EMULATOR_HOST`** is set, merge **`getBigQueryClientOptions()`** from
`lib/bigqueryEmulatorClientOptions.js` into **`new BigQuery({ ... })`** (see
`setUserAgent.js` and `setClientEndpoint.js`).

## Environment

| Variable | Purpose |
| -------- | ------- |
| **`BIGQUERY_EMULATOR_HOST`** | HTTP BigQuery REST listener. You may use `host:port` or `http://host:port`. A host without a scheme is normalized to **`http://…`** so the client does not default to HTTPS against the local emulator. |
| **`NODE_SAMPLES_PROJECT_ID`** | Optional explicit project id for the client (also reads **`GOLANG_SAMPLES_PROJECT_ID`**, **`GOOGLE_CLOUD_PROJECT`**, **`GCLOUD_PROJECT`**). |
| **`BIGQUERY_EMULATOR_CLIENT_API_REGION`** | Optional region sent as **`X-BigQuery-Emulator-Api-Region`** on each request so the emulator can apply regional rules while the TCP host is loopback (same idea as **golang-samples** `bqopts`). |

The **`@google-cloud/bigquery`** library also reads **`BIGQUERY_EMULATOR_HOST`** directly in its
constructor; the helpers above only add scheme normalization, project id, and the optional
region header.

## Smoke test

From this directory, with the emulator running and **`BIGQUERY_EMULATOR_HOST`** exported (for
example from the parent repo’s **`.envrc`**):

```bash
npm install
npx mocha test/clients.test.js --timeout 200000
```

Without **`BIGQUERY_EMULATOR_HOST`**, the same tests assert regional **`*.googleapis.com`**
endpoints as in the upstream samples.
