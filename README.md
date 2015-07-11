# aurelia-input-validation
validation plugin for Aurelia to give easy validation capabilities

Include index.js in your project. Set up validation functions in typeValidators.js. Implement in template like so:

```html
<input type="text" value.bind="myValue" validation="Text" />
```

or

```html
<input type="text" value.bind="myValue" validation.one-time="variableForValidationType" />
```

Still a work in progress.

