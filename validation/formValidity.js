export class FormValidity {

    static formValidityMap = new WeakMap();

    internalValidityStateMap = new Map();

    constructor(formElement) {
        this.submitButton = $('button[type="submit"]', formElement); 
    }

    static getInstance(formElement) {

        var instance = void(0);

        var existingInstance = FormValidity.formValidityMap.get(formElement);
        if (existingInstance) {
            instance = existingInstance;
        } else {
            instance = new FormValidity(formElement);
            FormValidity.formValidityMap.set(formElement, instance);
        }

        return instance;
    }

    getValidityState(inputContext) {
        var sum = 0;
        //if any of the input states is invalid form is invalid
        this.internalValidityStateMap.forEach((i) => { sum += (i) ? 0 : -1; })
        return sum === 0;
    }

    setValidityState(inputValidatorContext, value) {

        this.internalValidityStateMap.set(inputValidatorContext, !!value);

        this.submitButton.prop('disabled', !this.getValidityState());
    }

    unsetValidityState(inputValidatorContext) {
        this.internalValidityStateMap.delete(inputValidatorContext);
    }
}