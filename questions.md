**What is the difference between Component and PureComponent? give an example where it might break my app.**

- A regular component will re-render whenever its shouldComponentUpdate method triggers.

- A pure component doesn't re-render by default when its parent re-renders. It handles the shouldComponentUpdate method, performing a shallow comparison on primitive values and references, re-rendering only when there's a difference.

Your app may break if you're providing non-primitive values (e.g arrays and objects) that are getting mutated over time. Since the pure component only checks the references, it won't detect a change.

**Context + ShouldComponentUpdate might be dangerous. Can think of why is that?**

- Because consumers of a context always re-render when the provider value changes, regardless if their parent element didn't update. So they are not subject to shouldComponentUpdate.

**Describe 3 ways to pass information from a component to its PARENT.**

- Callbacks
- Contexts
- External data stores (e.g Redux)

**Give 2 ways to prevent components from re-rendering.**

- Memoization (useMemo, useCallback)
- Using a ref (useRef)

**What is a fragment and why do we need it? Give an example where it might break my app.**

- A fragment is a react element that allows you to return multiple elements without the need for a parent element. For example, if you have a Table component and want to define a Columns component, with a few table cells, you'd have to wrap it in another element in order to return it, such as a div, which would break the semantics / structure of the code.
In order to solve this, we can wrap the table cells in a fragment that acts as a parent element but doesn't get rendered.

**Give 3 examples of the HOC pattern.**
- Components to handle application flow such as routing (e.g withRouter) and authentication (e.g requiresAuth)

- Components for adding reusable UI behaviors such as adding standardized loading states (e.g withLoader) or validating inputs (e.g validatedInput
)

- Components to handle 3rd party integrations such as state management libraries (e.g "connect" from react-redux)

**what's the difference in handling exceptions in promises, callbacks and async...await.**

- In callbacks, we can use standardize the inputs where its there's an error, it will come as the first argument. Otherwise, it will be set to null, and the result will be sent in the second argument (e.g Node.js APIs).

- In promises, we can perform control flow by using the then() and catch() methods that get triggered according to the status of the promise (fulfilled/rejected).

- In async/await, we can wrap the code in a try/catch block, which allows us to catch any exceptions and handle them accordingly based on the error/arguments provided.

**How many arguments does setState take and why is it async.**
- setState is asynchronous due to its expensive nature. Depending on the operation performed,
it would render the browser unresponsive, degrading the user experience.

It can receive two arguments:
  1. the updater, which can be the state to be updated, or a function that takes in the previous state and the props as arguments
  and returns the new state
  2. An optional callback to be triggered after the state is updated and the component is re-rendered.

**List the steps needed to migrate a Class to Function Component.**

- Create a function with the component name
- Receive a props object as an argument of this function
- Migrate internal state to its appropriate hooks
- Move internal functions to its own implementations
- Migrate lifecycle methods to its appropriate hooks (e.g useEffect)
- Remove the constructor function
- Remove any "this" references
- Remove the render function and set its content as the return value of this new function.

**List a few ways styles can be used with components.**
- Inline styles
- External stylesheets
- CSS modules
- CSS-in-JS

**How to render an HTML string coming from the server**

- Without 3rd party libraries, we can use dangerouslySetInnerHTML. It will act as the innerHTML attribute, rendering unescaped code into the page (at risk of XSS issues).