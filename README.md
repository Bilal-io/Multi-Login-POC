# Multi Login POC

A POC project created using Angular to demonstrate how to imitate Google's multi login feature, with an attempt to avoid their implementation's caveats.

## Article

You can find my published blog post named [A Single App, Multi Login](https://bilalkhoukhi.com/blog/single-app-multi-login) which discusses this POC ad the motive behind it. 

## How to run
run `npm install` then `npm start` to start the project.

There are 4 hardcoded users, test1 through test4.
The password is already filled in the login form.

Existing pages:
- localhost:4200/login
- localhost:4200/dashboard - lazy loaded and protected, must be authenticated
- localhost:4200/dashboard/test - lazy loaded and protected, must be authenticated
- localhost:4200/admin - lazy loaded and protected, requires an admin user (test2, and test3)
