import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';
// Don't forget to import the dotenv package!
import * as dotenv from 'dotenv';

dotenv.config();

const otlpTraceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
});
const otlpMetricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
});

const spanProcessor =
  process.env.NODE_ENV === 'production'
    ? new BatchSpanProcessor(otlpTraceExporter)
    : new SimpleSpanProcessor(otlpTraceExporter);

export const otelSDK = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: process.env.npm_package_version,
  }),
  autoDetectResources: true,
  spanProcessor,
  metricReader: new PeriodicExportingMetricReader({
    exporter: otlpMetricExporter,
  }),
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new PrismaInstrumentation(),
  ],
});
