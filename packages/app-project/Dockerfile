FROM zooniverse/front-end-monorepo:latest

ARG ASSET_PREFIX
ENV ASSET_PREFIX=$ASSET_PREFIX

ARG COMMIT_ID
ENV COMMIT_ID=$COMMIT_ID

ARG SENTRY_DSN
ENV SENTRY_DSN=$SENTRY_DSN

ARG APP_ENV=production
ENV APP_ENV=$APP_ENV

ENV NODE_ENV production
ENV PANOPTES_ENV production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /usr/src/packages/app-project/

RUN yarn build

ENV PORT 3000
EXPOSE 3000

CMD [ "yarn", "start" ]