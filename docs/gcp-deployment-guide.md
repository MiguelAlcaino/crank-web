# Google Cloud Run Deployment Guide — crank-web

Vue 3 SPA served by nginx on Cloud Run in `me-central1` (Doha).

## Prerequisites

- `gcloud` CLI authenticated with `crank-fit` project
- Artifact Registry repo `crank-web` in `me-central1`

## 1. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create crank-web \
  --repository-format=docker \
  --location=me-central1
```

## 2. Build and Push

The build requires **build args** for Vite env vars (baked into the JS bundle at build time):

```bash
cd /path/to/crank-web

gcloud builds submit \
  --config=cloudbuild.yaml \
  --region=me-central1
```

Or manually with `--tag` and `--build-arg`:
```bash
gcloud builds submit \
  --tag me-central1-docker.pkg.dev/crank-fit/crank-web/crank-web \
  --region=me-central1
```
Note: manual `--tag` builds use the `.env` defaults. The `cloudbuild.yaml` passes the correct build args.

## 3. Deploy

```bash
gcloud run deploy crank-web \
  --image me-central1-docker.pkg.dev/crank-fit/crank-web/crank-web \
  --region me-central1 --platform managed \
  --allow-unauthenticated \
  --port 80 \
  --min-instances=0 \
  --max-instances=5
```

## 4. Cloud Build Trigger (Auto-Deploy)

1. Connect `MiguelAlcaino/crank-web` repo in Cloud Build
2. Create trigger:
   - **Name**: `deploy-crank-web`
   - **Region**: `me-central1`
   - **Event**: Push to `^shopping-cart$`
   - **Config**: `cloudbuild.yaml`
   - **Service account**: `930523966479-compute@developer.gserviceaccount.com`

## Build-Time Environment Variables

These are **baked into the JS bundle** at Docker build time via Vite. They cannot be changed at runtime. They're set as `--build-arg` in `cloudbuild.yaml`:

| Variable | Value | Purpose |
|---|---|---|
| `VITE_CRANK_REST_SERVER_URL` | `https://crank-payments-930523966479.me-central1.run.app` | REST API base URL |
| `VITE_CRANK_GRAPHQL_SERVER_URL` | `https://crank-payments-930523966479.me-central1.run.app/api/graphql/` | GraphQL endpoint |
| `VITE_CRANK_PAYMENTS_URL` | `https://crank-payments-930523966479.me-central1.run.app` | Payments service URL |

To change these, update `cloudbuild.yaml` and rebuild.

## Runtime Environment Variables

Set via Cloud Run console or `gcloud run services update`:

| Variable | Purpose |
|---|---|
| `APPLE_MERCHANT_ID_DOMAIN_ASSOCIATION` | Apple Pay domain association (optional) |

## Architecture

```
crank-web (Cloud Run, me-central1)
  ├── Vue 3 SPA built with Vite
  ├── Served by nginx on port 80
  ├── Health check: GET /health → "healthy"
  ├── Auto-scales 0-5 instances
  └── Connects to crank-payments API (build-time URLs)
```

## Key Files

| File | Purpose |
|---|---|
| `cloudbuild.yaml` | Cloud Build pipeline with Vite build args |
| `service.yaml` | Cloud Run spec (reference) |
| `Dockerfile` | Multi-stage: Node 18 build → nginx:alpine serve |
| `nginx.conf` | nginx config with SPA routing |
| `docker-entrypoint.sh` | Sets up Apple Pay domain association + starts nginx |

## Useful Commands

```bash
# Health check
curl https://crank-web-930523966479.me-central1.run.app/health

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=crank-web" \
  --limit=30 --format="value(textPayload)" --project=crank-fit

# Manual deploy
gcloud builds submit --config=cloudbuild.yaml --region=me-central1
gcloud run deploy crank-web \
  --image me-central1-docker.pkg.dev/crank-fit/crank-web/crank-web \
  --region me-central1 --platform managed
```
