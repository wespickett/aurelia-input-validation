import {inject} from 'aurelia-dependency-injection';
import {customAttribute, bindable, ObserverLocator} from 'aurelia-framework';
import builtInValidator from './typeValidators';
import {FormValidity} from './formValidity';

/**
* Run validation on a form. Disable the submit button until valid and field level error messages
*
* @class validate
* @constructor
* @param {Element} element The element that the to bind to
*/

@customAttribute('validation')
@inject(Element, ObserverLocator, builtInValidator, FormValidity)
export class Validation {
    @bindable required;

    constructor(element, observerLocator, builtInValidator, FormValidity) {
        this.element = element;
        this.observerLocator = observerLocator;
        this.builtInValidator = builtInValidator;

        this.observerLocator.getObserver(this.element, 'value')
                            .subscribe(this.validationValueChanged.bind(this));

        //check for static or dynamic required attribute
        this.isRequired = this.element.hasAttribute('required');
        this.observerLocator.getObserver(this.element, 'required')
                            .subscribe(this.requiredChanged.bind(this));

        //disable browser validation
        this.element.form.noValidate = true;

        this.formValidity = FormValidity.constructor.getInstance(this.element.form, this.isRequired);

        //Disable form submit if there is a required field.
        //If field is initially valid, it will enable itself upon validation
        if (this.isRequired) this.formValidity.setValidityState(this, false);
    }

    validate() {

        //Don't validate originally empty inputs
        if (!this.oldValue && !this.currentValue) {
            //remove any left over invalid class from reused inputs
            $(this.element).removeClass('invalid');
            return;
        }

        var validator = this.validationStrategy(this.validationType);

        if (validator && typeof validator.validate === 'function') {

            var isValid = validator.validate(this.currentValue, this.isRequired);
            var errorMsg = validator.msg || '';

            //Catch empty required field, if not handled by validator
            if (!this.currentValue && this.isRequired) {
                isValid = false;
                errorMsg = errorMsg || 'This field is required.'; //TODO make message a value from a strings file
            } else if (!this.currentValue && !this.isRequired) {
                isValid = true;
            }

            //set form validity state to disable/enable submit button
            this.formValidity.setValidityState(this, isValid);

            //set this input visual invalid state if not valid
            $(this.element).toggleClass('invalid', !isValid);

            //TODO: populate error message label with returned error message if there is one

        }
    }

    validationStrategy(validationType) {
        var validator;

        if (typeof validationType === "string") {
            //use built in validator for type if exists
            if (this.builtInValidator[validationType]) {
                validator = this.builtInValidator[validationType];
            }
        } else if (typeof validationType === "function") {
            //run custom validation function
            validator = validationType;
        }

        return validator;
    }

    //watches the (model) value attached to the input
    validationValueChanged(newValue, oldValue) {
        this.currentValue = newValue;
        this.oldValue = oldValue;
        this.validate();
    }

    //Watches the value of the validation attribute
    //Either a string refering to a value type eg. Url, Text,
    //Or, a custom validation object
    valueChanged(newValue) {
        this.validationType = newValue;
        this.validate();
    }

    requiredChanged(newValue) {
        this.isRequired = !!newValue;
    }

    unsetValidity() {
        if (this.formValidity) {
            this.formValidity.unsetValidityState(this);
        }
    }

    unbind() {
        this.unsetValidity();
    }

    detached() {
        this.unsetValidity();
    }

}