(() => {
    // Before using it we must add the parse and format functions
      // Here is a sample implementation using moment.js
    // let validate = require('validate.js');
    validate.extend(validate.validators.datetime,
    {
        // The value is guaranteed not to be null or undefined but otherwise it
        // could be anything.
        parse: (value, options) => {
            return +moment.utc(value);
        },
        // Input is a unix timestamp
        format: (value, options) => {
            let format = options.dateOnly
                                ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
            return moment.utc(value).format(format);
        },
    });

      // These are the constraints used to validate the form
      let constraints = {

        'first_name': {
            // You need to pick a fistname
            presence: true,
            format: {
              // We don't allow anything that a-z and A-Z
              pattern: '[a-zA-Z]+',
              // but we don't care if the username is uppercase or lowercase
              flags: 'i',
              message: 'can only contain a-z and 0-9',
            },
          },

          'last_name': {
              // You need to pick a lastname too
              presence: true,
              format: {
                // We don't allow anything that a-z and A-Z
                pattern: '[a-zA-Z]+',
                // but we don't care if the username is uppercase or lowercase
                flags: 'i',
                message: 'can only contain a-z and 0-9',
              },
            },

        'email_addr': {
          // Email is required
          presence: true,
          // and must be an email (duh)
          email: true,
        },
        'postal_code': {
          // Password is also required
          presence: true,
          // And must be at least 5 characters long
          length: {
            minimum: 5,
          },

          format: {
            // We don't allow anything that a-z, A-Z and 0-9
            pattern: '[a-zA-Z0-9]+',
            flags: 'i',
            message: 'can only contain a-z and 0-9',
          },
        },

        'phone_number': {
            presence: true,
            // Phone number is required
            length: {
                minimum: 5,
              },

            format: {
                // We allow numbers and bracket, dash
                pattern: '[(][0-9]{3}[)] [0-9]{3}-[0-9]{2}-[0-9]{2}',
                flags: 'i',
                message: 'must match the format',
            },
        },
        'card_number': {
            presence: true,
            // must contain at least 19 numbers and dashs
            length: {
                minimum: 19,
                },

            format: {
                // We only allow anything that 0-9 and dash
                pattern: '[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}',
                flags: 'i',
                message: 'must match the format',
            },
        },
        'security_code': {
          // security code is required
          presence: true,
        },
        'expiration_date': {
            // The user needs to give a expiration date
            presence: true,
            date: {
                earliest: moment().subtract(0, 'years'),
                message: '^Expiration date must be after today',
            },
        },
      },
        // Hook up the form so we can prevent it from being posted
        form = document.querySelector('form.checkout-form');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            handleFormSubmit(form);
        });

      const handleFormSubmit = (form, input) => {
        // validate the form aainst the constraints
        let errors = validate(form, constraints);
        // then we update the form to reflect the results
        showErrors(form, errors || {});
        if (!errors) {
          showSuccess();
        }
      },

      // Updates the inputs with the validation errors
      showErrors = (form, errors) => {
        // We loop through all the inputs and show the errors for that input
        _.each(form.querySelectorAll('input[name], select[name]'),
            (input) => {
            // Since the errors can be null if
            // no errors were found we need to handle
            // that
            showErrorsForInput(input, errors && errors[input.name]);
            });
      },

      // Shows the errors for a specific input
      showErrorsForInput = (input, errors) => {
        // This is the root of the input
        let formGroup = closestParent( input.parentNode, 'mdl-textfield' ),
          // Find where the error messages will be insert into
            messages = formGroup.querySelector('.messages');
        // First we remove any old messages and resets the classes
        resetFormGroup(formGroup);
        // If we have errors
        if (errors) {
          // we first mark the group has having errors
          formGroup.classList.add('has-error');
          // then we append all the errors
          _.each(errors, (error) => {
            addError(messages, error);
          });
        } else {
          // otherwise we simply mark it as success
          formGroup.classList.add('has-success');
        }
      },
      // Recusively finds the closest parent that has the specified class
        closestParent = (child, className) => {
        if (!child || child == document) {
          return null;
        }
        if (child.classList.contains(className)) {
          return child;
        } else {
          return closestParent(child.parentNode, className);
        }
      },

      resetFormGroup = (formGroup) => {
        // Remove the success and error classes
        formGroup.classList.remove('has-error');
        formGroup.classList.remove('has-success');
        // and remove any old messages
        _.each(formGroup.querySelectorAll('.help-block.error'), (el) => {
          el.parentNode.removeChild(el);
        });
      },

      // Adds the specified error with the following markup
      // <p class="help-block error">[message]</p>
      addError = (messages, error) => {
        let block = document.createElement('p');
        block.classList.add('help-block');
        block.classList.add('error');
        block.innerText = error;
        messages.appendChild(block);
      },

      showSuccess = () => {
        // We made it \:D/
        alert('Success!');
      };
})();
