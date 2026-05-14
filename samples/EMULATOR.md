# BigQuery Node samples and the go-googlesql emulator

When **`BIGQUERY_EMULATOR_HOST`** is set, merge **`getBigQueryClientOptions()`** from
`lib/bigqueryEmulatorClientOptions.js` into **`new BigQuery({ ... })`** (see
`setUserAgent.js` and `setClientEndpoint.js`).

## Environment

| Variable | Purpose |
| -------- | ------- |
| **`BIGQUERY_EMULATOR_HOST`** | HTTP BigQuery REST listener. You may use `host:port` or `http://host:port`. A host without a scheme is normalized to **`http://…`** so the client does not default to HTTPS against the local emulator. |
| **`NODE_SAMPLES_PROJECT_ID`** | Optional explicit project id for the client (also reads **`GOLANG_SAMPLES_PROJECT_ID`**, **`GOOGLE_CLOUD_PROJECT`**, **`GCLOUD_PROJECT`**). |
| **`GOLANG_SAMPLES_PROJECT_ID`** | Same as go-googlesql / **`.envrc`**: used when the Google project env vars are unset. |
| **`EMULATOR_PROJECT_ID`** | With **`BIGQUERY_EMULATOR_HOST`** only, defaults the sample project id to this value (else **`dev`**). |
| **`BIGQUERY_EMULATOR_CLIENT_API_REGION`** | Optional region sent as **`X-BigQuery-Emulator-Api-Region`** on each request so the emulator can apply regional rules while the TCP host is loopback (same idea as **golang-samples** `bqopts`). |

Mocha runs **`test/setup.js`** first (`npm test` / **`package.json`** **`--require`**). That copies the resolved project id into **`GOOGLE_CLOUD_PROJECT`** and **`GCLOUD_PROJECT`** when unset so **`new BigQuery()`** does not call **`findAndCacheProjectId`** against metadata.

The **`@google-cloud/bigquery`** library also reads **`BIGQUERY_EMULATOR_HOST`** directly in its
constructor; the helpers above only add scheme normalization, project id, and the optional
region header.

## Smoke test

From this directory, with the emulator running and **`BIGQUERY_EMULATOR_HOST`** exported (for
example from the parent repo’s **`.envrc`**):

```bash
npm install
npx mocha test/clients.test.js --timeout 200000 --require ./test/setup.js
```

Without **`BIGQUERY_EMULATOR_HOST`**, the same tests assert regional **`*.googleapis.com`**
endpoints as in the upstream samples.

## Full suite

**`npm test`** runs all Mocha files under **`test/`** (integration-style: expects **GCP
Application Default Credentials** and a project, or every test wired to the emulator). The
parent repo exposes that as **`task thirdparty:node-samples:bigquery-test-full`**.

The default **`task thirdparty:node-samples:bigquery-test`** runs only **`test/clients.test.js`**
(plus **`test/setup.js`**): endpoint / user-agent checks, and—when **`BIGQUERY_EMULATOR_HOST`**
is set—a **`SELECT 1`** so the emulator process should log at least one HTTP request. The
first two checks only construct **`BigQuery`** and print **`apiEndpoint`**; they do **not**
open a TCP connection by themselves.
