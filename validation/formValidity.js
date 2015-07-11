export class FormValidity {

    static formValidityMap = new Map();

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

    setValidityState(inputContext, value) {

        this.internalValidityStateMap.set(inputContext, !!value);

        this.submitButton.prop('disabled', !this.getValidityState());
    }
}