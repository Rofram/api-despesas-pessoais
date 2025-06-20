export function otelConfigFactory() {
  return {
    metrics: {
      hostMetrics: true, // Includes Host Metrics
      apiMetrics: {
        enable: true, // Includes api metrics
        defaultAttributes: {
          // You can set default labels for api metrics
          custom: 'label',
        },
        ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
        ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
      },
    },
  };
}
