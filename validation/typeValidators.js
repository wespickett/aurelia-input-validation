export default {
    'Text': {
        msg: 'Please enter a valid value',
        validate: function(currentValue) {
            return /^[a-z]+$/i.test(currentValue);
        }
    },
    'Url': {
        msg: 'Please enter a valid url',
        validate: function(currentValue) {
            return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(currentValue);
        }
    },
    
}