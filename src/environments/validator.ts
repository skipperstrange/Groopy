import { Validators } from '@angular/forms';

export namespace Validator {

    export const emailValidator = ['', [
        Validators.required,
        Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]
    ];

    export const passwordValidator = ['', [
        Validators.required, Validators.minLength(6)
    ]]

    export const nameValidator = ['', [
        Validators.required,
    ]]

    export const usernameValidator = ['', [
        Validators.required,
        Validators.minLength(5)
    ]]

    export const bioValidator = ['', [
        Validators.required,
    ]]

    export const groupNameValidator = ['', [
        Validators.required,
    ]]

    export const groupDescriptionValidator = ['', [
        Validators.required,
    ]]

    export const errorMessages = {
        email: [
            { type: 'required', message: 'Email is required' },
            { type: 'pattern', message: 'Email looks like invalid' },
        ],
        password: [
            { type: 'required', message: 'Password is required' },
            { type: 'minlength', message: 'Password must be 6 char' },
        ],
        name: [
            { type: 'required', message: 'Name is required' },
        ],
        username: [
            { type: 'required', message: 'Username is required' },
            { type: 'minlength', message: 'Username must be 5 char' },
        ],
        bio: [
            { type: 'required', message: 'Bio is required' },
        ],
        groupName: [
            { type: 'required', message: 'Group Name is required' },
        ],
        groupDescription: [
            { type: 'required', message: 'Group Description is required' },
        ],

    }
}