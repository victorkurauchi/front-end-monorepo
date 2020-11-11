FROM node:12

RUN mkdir -p /usr/src
WORKDIR /usr/src/

COPY ./ /usr/src
RUN chown -R node:node .

USER node

RUN yarn install

RUN yarn workspace @zooniverse/react-components build

RUN yarn workspace @zooniverse/classifier build

ARG COMMIT_ID
ENV COMMIT_ID=$COMMIT_ID

ENV PANOPTES_ENV production

ENV NODE_ENV production

ARG APP_ENV=production
ENV APP_ENV=$APP_ENV

ENV NEXT_TELEMETRY_DISABLED=1

ARG CONTENTFUL_ACCESS_TOKEN

ARG CONTENTFUL_SPACE_ID

ARG CONTENT_ASSET_PREFIX
ENV CONTENT_ASSET_PREFIX=$CONTENT_ASSET_PREFIX

ARG SENTRY_CONTENT_DSN
ENV SENTRY_CONTENT_DSN=$SENTRY_CONTENT_DSN

RUN yarn workspace @zooniverse/fe-content-pages build

ARG SENTRY_PROJECT_DSN
ENV SENTRY_PROJECT_DSN=$SENTRY_PROJECT_DSN

ARG PROJECT_ASSET_PREFIX
ENV PROJECT_ASSET_PREFIX=$PROJECT_ASSET_PREFIX

RUN yarn workspace @zooniverse/fe-project build
