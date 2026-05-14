// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const {normalizeBigQueryEmulatorHost} = require('./normalizeBigQueryEmulatorHost');

// Matches api/datasets/host_region.go (go-googlesql emulator).
const headerBigQueryEmulatorAPIRegion = 'X-BigQuery-Emulator-Api-Region';

/**
 * Returns constructor options to merge into `new BigQuery({ ... })` when
 * BIGQUERY_EMULATOR_HOST is set (after normalizing scheme in env). Empty object
 * when the emulator host is unset.
 */
function getBigQueryClientOptions() {
  normalizeBigQueryEmulatorHost();
  if (!process.env.BIGQUERY_EMULATOR_HOST) {
    return {};
  }
  const projectId =
    process.env.NODE_SAMPLES_PROJECT_ID ||
    process.env.GOLANG_SAMPLES_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT;
  const region = process.env.BIGQUERY_EMULATOR_CLIENT_API_REGION;
  const interceptors_ = [];
  if (region) {
    interceptors_.push({
      request(reqOpts) {
        reqOpts.headers = Object.assign({}, reqOpts.headers, {
          [headerBigQueryEmulatorAPIRegion]: region,
        });
        return reqOpts;
      },
    });
  }
  return {
    ...(projectId ? {projectId} : {}),
    ...(interceptors_.length ? {interceptors_} : {}),
  };
}

module.exports = {getBigQueryClientOptions};
