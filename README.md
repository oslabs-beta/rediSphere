# rediSphere 📈

rediSphere is an open source web application for visualizing Redis performance metrics in realtime dashboards. It aims to provide developers an intuitive way to gain visibility into their caching databases and quickly resolve issues.

## Overview

rediSphere fetches key Redis statistics every second and plots the timeseries data in customizable charts. It eliminates the need for manually parsing verbose logs and terminal outputs.

The core metrics displayed include:

- Cache hit/miss ratios 🔍
- Memory usage 💾
- Average latency times ⏱️
- Evictions and expirations 🗑️

Users can enable various combinations of charts to create dashboard views tailored to their use cases. The dashboard auto-refreshes with the latest metrics pulled from the Redis instance.

## Installation

To install rediSphere:

1. Clone the repository

   ```bash
   git clone https://github.com/oslabs-beta/cache-app.git
   ```

2. Install NPM dependencies

   ```bash
   npm install
   ```

3. Create a .env file with MongoDB connection URI:

   ```bash
   MONGO_URI="your_mongodb_connection_string"
   ```

Sessions and user accounts are stored in a MongoDB database.

Credentials for accessing the Redis database to be monitored are collected from the user through rediSphere's account creation and connection flow.

A note on security: rediSphere **HIGHLY** recommends creating a specific Redis user account restricted to read-access only for your database. The ONLY permissions necessary for the app to function is access to the INFO command, but if you supply credentials with more privileges, there's always the chance that bad actors could use the monitoring service to gain access to your cache data. Be smart, and take the extra couple minutes to create a limited-permissions account to use specifically for monitoring.

## Dashboard & Features

To start monitoring your Redis database, create a user account on the sign-in page, and provide your Redis credentials to give rediSphere access to your Redis instance.

The main rediSphere dashboard displays the enabled performance charts in customizable widget boxes:

[Show Image](https://addalinktoscreenshot.com/image.png)

By clicking the plus button, you can add widgets for varying metrics.

Arrange multiple widgets to tailor your view and get just the metrics you want to see. Remove any widgets later as needed. Your dashboard setup will be saved alongside your user credentials for the next time you log in.

**Available Widget Metrics**

- **Cache Hit/Miss Ratio** - See cache hit and miss rates over time. A low hit % indicates suboptimal caching performance.
- **Average Latency** - Track average get request response times and total queries. Spikes may indicate overloaded servers. Note that this specifically displays only server latency, not network latency, to avoid any confounding data arising from a bad connection.
- **Evictions & Expirations** - Monitor eviction and expiration counts over time. Rising trends can pinpoint undersized cache capacity.
- **Memory Usage** - View current memory used and peak memory consumed as percentages. Compare to total cache capacity.

The dashboard auto-refreshes all widget charts every second with the latest performance data pulled from your connected Redis database.

## Data Fetching

rediSphere uses the Redis INFO command to retrieve current statistics including cache hit ratios, latency, memory usage etc.

The backend server polls the Redis INFO API every 1 second to fetch the latest performance data. It parses the returned string statistics into JSON structures and passes them to the front-end on demand.

The React front end dashboard subscribes to backend API endpoints serving this Redis data. The components re-request updated data every second to populate the visible charts and graphs.

This allows all widget visualizations on user dashboards to auto-refresh with realtime analytics reflecting the current state of their Redis instance. If any connectivity issues disrupt the data stream, widgets will show static displays until connection is regained.

By default, metrics are shown for a 2 minute trailing time window.

## Roadmap

The current rediSphere MVP focuses on realtime monitoring of Redis cache performance.

Future roadmap plans include:

- Persistent monitoring w/historical data support
- Adding support for additional options for providing Redis credentials:
  - X509 Certificate based authentication
  - API-key authorization
- Incorporating Redis Slow Log analytics into latency metrics
- Developing notification alerts for thresholds
- Additional customization for widgets, including:
  - Custom time period
  - Dynamic zoom/enlargement
- Export functionality for logged data for analysis on other platforms

Community feature requests and contributions are encouraged and welcomed to expand rediSphere capabilities!

## Contributing

Contributions to enhance rediSphere are welcomed!

To contribute:

1. Fork the repository
2. Create your feature branch

```
git checkout -b new-feature
```

3. Commit changes with clear commit messages
4. Push to your fork
5. Open a Pull Request against `development` branch including details of changes

We ask that, before submitting any significant code changes:

- You open an Issue to discuss proposals
- Ensure PRs only tackle one feature/bugfix each
- Write tests covering any new functionality
- Maintain existing coding style
- Update documentation accordingly

Some ways to help:

- Implement additional widget styling and customizations
- Add ability to persist historical metric data
- Improve general UI/UX
- Expand test coverage

... And anything else you have in mind! Let us know if you have any other ideas on how to enhance rediSphere!
