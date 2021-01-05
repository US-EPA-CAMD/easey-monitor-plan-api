# EASEY Monitor Plan API
[![GitHub](https://img.shields.io/github/license/US-EPA-CAMD/easey-monitor-plan-api)](https://github.com/US-EPA-CAMD/easey-monitor-plan-api/blob/develop/LICENSE.md)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=US-EPA-CAMD_easey-monitor-plan-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=US-EPA-CAMD_easey-monitor-plan-api)
[![Develop Branch Pipeline](https://github.com/US-EPA-CAMD/easey-monitor-plan-api/workflows/Develop%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-monitor-plan-api/actions)<br>
Monitor Plan data API for the EPA CAMD Business Systems EASEY Application

The monitor plan API endpoints return the monitor plans of a particular facility, monitor methods of a particular monitor location, and the supplemental methods of a particular monitor location.
​
## Getting Started
​
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to set up the following in order to access the database:
- Environment variables
- Cloud.gov SSH tunnel

**Environment Variables**

Please reach out to an EPA tech lead (see Mike Heese or Jason Whitehead) to get the values for these variables:

- EASEY_DB_HOST
- EASEY_DB_NAME
- EASEY_DB_PORT
- EASEY_DB_PWD
- EASEY_DB_USER

These are to be used for developmental purposes only. 

**Cloud.gov SSH tunnel**

1. Log into cloud.gov
2. Go to https://login.fr.cloud.gov/passcode 
3. Enter in the temporary token code from your authentication app (Google Authenticator) to recieve a temporary authentication code
3. In your terminal input the following:
```bash
cf login -a api.fr.cloud.gov --sso
```
4. Type in the authenthication code recieved earlier
5. Target the development org (you will need to be granted permission for access to this):
```bash
cf target -o <ORGNAME> -s dev
```
6. Open SSH tunnel
7. Keep the SSH tunnel open while running the application

### Installing
1. Open your terminal and navigate to the directory you wish to store this repository.

2. Clone this repository

    ```shell
    # If using SSH
    git clone git@github.com:US-EPA-CAMD/easey-monitor-plan-api.git
    
    # If using HTTPS
    git clone https://github.com/US-EPA-CAMD/easey-monitor-plan-api.git
    
    ```

3. Navigate to the root project directory

    ```
    cd easey-monitor-plan-api
    ```

4. Install dependencies 
    
    ```
    npm install
    ```
### Run the appication 

From within the `easey-monitor-plan-api` project directory, you can run:

```bash
# Runs the api in the development mode
npm run start:dev
```

Open [http://localhost:8080/api/monitor-plan-mgmt/swagger/](http://localhost:8080/api/monitor-plan-mgmt/swagger) to view swagger documentation.
> NOTE: The port can be changed by setting the EASEY_MONITOR_PLAN_MGMT_API_PORT environment variable

The page will reload if you make edits via the use of nodemon.<br />
You will also see any lint errors in the console.

```bash
# for production mode
npm run start
```

### Run the tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## API Endpoints

**Monitor Plan** 

### ​GET /api/monitor-plan-mgmt/monitor-plans/{orisCode}/configurations

Gets all monitor plans for the facility with the specified orisCode.

Parameters: 
Name | Required | Type | Path/Query
-- | -- | -- | --
orisCode | required | number | path
<br />

**Monitor Locations**

### ​GET /api/monitor-plan-mgmt/monitor-locations
> Note: Work In Progress

<br />

**Monitor Methods**

### GET /api/monitor-plan-mgmt/monitor-locations/{id}/methods
Gets all monitor methods for the specified monitor location. 

Parameters:
Name | Required | Type | Path/Query
-- | -- | -- | --
id | required | string | path
<br />

**Supplemental Methods**

### GET /api/monitor-plan-mgmt/monitor-locations/{id}/Supplementalmethods
Gets all supplemental methods for the specified monitor location. 

Parameters: 
Name | Required | Type | Path/Query
-- | -- | -- | --
id | required | string | path
<br />

## Built With
​
[NestJS](https://nestjs.com/) - server-side Node.js framework

cloud.gov - Platform as a Service (PaaS)
​ 
​
## License
​
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details