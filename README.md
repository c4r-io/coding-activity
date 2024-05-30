## Live link
Main: [https://coding-activity.vercel.app](https://coding-activity.vercel.app)

Preview: [https://coding-activity-git-dev-c4r-io.vercel.app](https://coding-activity-git-dev-c4r-io.vercel.app)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages

```
path:
/login

Login and registration

path:
/coding-activity/:activityid

Coding activity output

path:
/dashboard/coding-activity/

List of coding activity

path:
/dashboard/coding-activity/:activityid

Edit coding activity

path:
/dashboard/coding-activity/:activityid/analytics

Analytics preview for each instance of coding activity

path:
/dashboard/coding-activity/:activityid/submissions

Feedback and issue navigator page

path:
/dashboard/coding-activity/:activityid/submissions/chat-feedback

Like dislike feedback page

path:
/dashboard/coding-activity/:activityid/submissions/code-executor-issue-list

Submitted issue list for each instance of coding activity
```

## Apis
```
path:
/api/analytics

methods:
get, post, delete
```
```
path:
/api/chat-feedback

methods:
get, post, delete
```
```
path:
/api/chat-feedback/:id

methods:
get, put, delete
```
```
path:
/api/code-executor-issue-list

methods:
get, post, delete
```
```
path:
/api/code-executor-issue-list/:id

methods:
get, put, delete
```
```
path:
/api/coding-activity

methods:
get, post, delete
```
```
path:
/api/coding-activity/:id

methods:
get, put, delete
```
```
path:
/api/login

methods:
post
```
```
path:
/api/register

methods:
post
```
```
path:
/api/student-authorization

methods:
post
```
```
path:
/api/upload

methods:
post
```
```
path:
/api/user

methods:
get, post
```
```
path:
/api/user/:id

methods:
get, put, delete
```

## error codes

| Error Code | Description |
|------------|-------------|
| 5000        | GPT API Error |
| 5001        | Feedback API Error  |