# Robo Patrol Web Application

[![Travis Build Status](https://travis-ci.org/robopatrol/robopatrol-webapp.svg?branch=master)](https://travis-ci.org/robopatrol/robopatrol-webapp)
[![Coverage Status](https://coveralls.io/repos/github/robopatrol/robopatrol-webapp/badge.svg?branch=master)](https://coveralls.io/github/robopatrol/robopatrol-webapp?branch=master)

## Running The App

To run the app, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) version 4 or greater is installed. This provides the platform on which the build tooling runs.
> **Note:**  The NodeJS version of Ubuntu 14.04 is really old and does not work. To install a newer version, follow  [these instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).

2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed globally. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
  > **Note:** Global installations have to be run as root or sudo. To avoid this, you can use a virtual node environment (e.g. [nodeenv](https://github.com/ekalinin/nodeenv)).

  > **Note:** Gulp must be installed globally, but a local version will also be installed to ensure a compatible version is used for the project.
4. Ensure that [jspm](http://jspm.io/) is installed globally. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
  > **Note:** Global installations have to be run as root or sudo. To avoid this, you can use a virtual node environment (e.g. [nodeenv](https://github.com/ekalinin/nodeenv)).

  > **Note:** jspm must be installed globally, but a local version will also be installed to ensure a compatible version is used for the project.

  > **Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm registry config github` and following the prompts. If you choose to authorize jspm by an access token instead of giving your password (see GitHub `Settings > Personal Access Tokens`), `public_repo` access for the token is required.
5. Install the client-side dependencies with jspm:

  ```shell
  jspm install -y
  ```
  >**Note:** Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install`.
6. To run the app, execute the following command:

  ```shell
  gulp watch
  ```
7. Browse to [http://localhost:9000](http://localhost:9000) to see the app. You can make changes in the code found under `src` and the browser should auto-refresh itself as you save files.

> The Skeleton App uses [BrowserSync](http://www.browsersync.io/) for automated page refreshes on code/markup changes concurrently across multiple browsers. If you prefer to disable the mirroring feature set the [ghostMode option](http://www.browsersync.io/docs/options/#option-ghostMode) to false

## Running the Robopatrol Simulation

To run the simulation and rosbridge websocket, follow these steps.

1. Install Turltebot Gazebo Simulation and [Rosbridge](http://wiki.ros.org/rosbridge_suite/Tutorials/RunningRosbridge) packages.
2. Launch Robopatrol Simulation

  ```shell
  roslaunch robopatrol robopatrol_simulation.launch
  ```

## Running The App under Electron

To run the app under [Electron](http://electron.atom.io), follow these steps.

1. Install [Electron](http://electron.atom.io)

  ```shell
  npm install electron-prebuilt -g
  ```
2. To start the app, execute the following command:

  ```shell
  electron index.js
  ```
>**Note:** If you use electron every time or are packaging and so-forth, Then change this line in package.json from
`"main": "dist/main.js",` to `"main": "index.js",`
Build the app (this will give you a dist directory)
```shell
gulp build
```
To start the app, execute the following command:
```shell
   electron .
```


## Bundling
Bundling is performed by [Aurelia Bundler](http://github.com/aurelia/bundler). A gulp task is already configured for that. Use the following command to bundle the app:

  ```shell
    gulp bundle
  ```

You can also unbundle using the command bellow:

  ```shell
    gulp unbundle
  ```

To start the bundled app, execute the following command:

  ```shell
    gulp serve-bundle
  ```
#### Configuration
The configuration is done by ```bundles.js``` file.
##### Optional
Under ```options``` of ```dist/aurelia``` add ```rev: true``` to add bundle file revision/version.

## Running The Unit Tests
You can run the tests with this command:

```shell
  gulp test
```

Or with code coverage:

```shell
  gulp cover
```

## Running The E2E Tests
Integration tests are performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e/src```
2. Install the necessary webdriver

  ```shell
  gulp webdriver-update
  ```

3. Configure the path to the webdriver by opening the file ```protractor.conf.js``` and adjusting the ```seleniumServerJar``` property. Typically its only needed to adjust the version number.

4. Make sure your app runs and is accessible

  ```shell
  gulp watch
  ```

5. In another console run the E2E-Tests

  ```shell
  gulp e2e
  ```

## Exporting bundled production version
A gulp task is already configured for that. Use the following command to export the app:

  ```shell
    gulp export
  ```
The app will be exported into ```export``` directory preserving the directory structure.
#### Configuration
The configuration is done by ```bundles.js``` file.
In addition, ```export.js``` file is available for including individual files.
