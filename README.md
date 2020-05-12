# Technical Assessment May 2020 - GitHub repository search

## Getting started

### Step 1: Install dependencies

In a terminal, from the root directory:
```
npm i
```

### Step 2: Add GitHub API Token

__IMPORTANT:__ You must create a (free) GitHub API token and add this to a custom `.env` file. You can copy `.env.example` and remove the extension, then add your token to the empty `REACT_APP_GITHUB_TOKEN` key.

See [this guide](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for instructions on setting up a token. The token only needs access to read public repositories.

### Step 3: Run application

```
npm run start
```

## Issues

Repositories are not currently being filtered by name, even with the directive `in:name` within the search query. My syntax seems to be correct according to official documentation. I suspect that the directive is being entirely ignored, I would need more time to troubleshoot this issue. The same behaviour can be seen in [GitHub's API Explorer](https://developer.github.com/v4/explorer) which leads me to think it may be a limitation of the v4 API.

## Design choices

### Typescript

Using typescript for strongly-typed components. Opted to disable prop-type checking for this assessment. For a production app there may be reasons to use both.

### ESLint/Prettier

Used a `create-react-app` starter template that configures Typescript, ESLint & Prettier out of the box, with the `airbnb` ruleset. I tweaked a few rules according to personal preferences. Code quality is important even in the early stages of a project.

[Go to template homepage](https://github.com/lindomar-oliviera/cra-template-ts-prettier-eslint-airbnb)

### GitHub API v4

Using the newer graphql API provided by GitHub. This prevents overfetching and having to parse responses for the keys that are needed.

[GitHub API v4 documentation](https://developer.github.com/v4/)

### Simple, on-demand searching

GitHub's API is rate-limited, so I wanted to minimise network requests. If the API was less restrictive I might have triggered a debounced fetch every keypress.

### UX

The brief stated it is not a concern of this assessment, however I still implemented some rudimentary styling and a simple flex-based layout.

I used CSS Modules for this, as it is the simplest and most powerful approach to styling react components. Class names are component-scoped to avoid collision, component portability is increased through looser coupling of function and style, stylesheet composition and SCSS directives are possible, and devs can write styles in native syntax rather than learning another library.

### Custom hook for querying GitHub repositories: useRepositories()

There were a few ways to approach the data fetching aspect. In the end, I decided to create a custom, self-contained hook. This would be an example of premature optimisation; not enough is known about the rest of the application and other features that need to be built, to make an informed choice about a more scalable option. Unknowns include how many data sources will need to be integrated with, whether some queries will need to use multiple sources, etc.

Implementing this as a hook this allowed me to keep the Repository feature entirely self-contained - there was no need to wrap the app in an ApolloProvider, for instance. This allows us to maintain more freedom until the app's data requirements become more complex, e.g. we can swap out the hook implementation or even the `Repositories` view completely.

Possible ways to scale this would be:

* Custom graphql server, queries and resolvers with github as a custom datasource
* Expand the available hooks, e.g. useUsers, useCommits, etc - this might make sense in a scenario where the app's features are purely GitHub-oriented, and there are no other data sources, for example
  * The hooks could be extracted into their own package and managed independently

### No state management library

For similar reasons mentioned above RE: premature optimisation. Furthermore, we want to refetch the data every time the page loads, to avoid stale results - so storing them makes even less sense.

### Responsiveness

A basic degree of responsiveness has been considered in the design of my layout and search results. It's not pretty, but the results display nicely on mobile devices and scale correctly on retina displays.

As the app scales, I would use a combination of media queries in the CSS Modules (where possible), and the `react-responsive` useMediaQuery hook for more complex requirements e.g. displaying different component trees.

### Pagination

My approach for implementing this would be to modify the `useRepositories` hook:

* Track a `cursor` for the last result internally
* Expose a `fetchMore` method that triggers a query on-demand with the cursor passed as `after` argument
* `push` results to existing `items` array instead of replacing it

The `SearchResults` component implementation should also be enhanced, for improved performance. Would likely use [`react-window`](https://github.com/bvaughn/react-window) with an infinite loader in a scenario where the API was not rate-limited, otherwise a simple 'load more' button, to trigger the exposed `fetchMore` method.

## Unit testing

Did not attempt this due to the two-hour limitation. In a production scenario I would write tests as I coded, covering key acceptance criteria/user stories/usage scenarios.

For example, there should be at least the following:
* Repositories
  * Displays error, loading and zero results states correctly
  * Displays returned items correctly
  * Submitting the search form triggers a search when the field is not empty
* SearchInput - triggers route change to resultsPath and appends input as query string, when form is submitted
* useRepositories
  * Returns isError = true and items are cleared when API call fails
  * Returns isLoading = true while API call in progress
  * Returns items once API call has succeeded
  * Does not perform query and clears items if no search term is provided

----------

## Original Brief

We would like you to create a base implementation of a React application to view a list of GitHub repositories with search functionality.

Think about how you would approach the task and try to describe your decisions in the Readme file.

We want to find out how you think, how you approach problems and how you communicate your decision and solutions. Imagine you have received this task as a Jira ticket and explain how you build it step by step.

### Acceptance Criteria

* Display repository’s Id, name, watchers_count
* Sort the results by the number of stars
* Have a search input that will show results (from all possible repositories) to those that have its name matches the search field.
* Think of this as a green-field project with the freedom to choose whatever you feel is best, e.g. 3rd party libraries can be used if necessary
* Feel free to use code bootstrapping tools (e.g. create-react-app) to save yourself time setting up the project
* There is no need to focus on the UX of the page
* As a rough guide, we don’t expect you to spend more than about 2 hours on this.
