'use strict';

import { NewInstance } from 'aurelia-dependency-injection'; 
import { ValidationController } from 'aurelia-validation';
import { required, email, equality, length } from 'aurelia-validatejs';
import { AuthService } from '../services/auth';
import { Router } from 'aurelia-router';
import toastr from 'toastr';
import swal from 'sweetalert';

export class Signup {
    
    @required
    @email
    email = '';
    
    @required
    @length({minimum: 6})
    password = '';
    
    @required
    @equality('password')
    confirmPassword = '';
    
    @required
    @length({is: 6})
    verificationCode = '';
    
    static inject = [AuthService, NewInstance.of(ValidationController), Router]
    constructor(auth, validationController, router) {
        this.auth = auth;
        this.validationController = validationController;
        this.router = router;
    }
    
    signup() {
        const errors = this.validationController.validate();
        if(errors.length !== 0) {
            return;
        }
        
        return this.auth.signup({
            email: this.email,
            password: this.password,
            verificationCode: this.verificationCode
        }).then(() => {
            swal({
                title: 'Welcome!',
                text: `Please confirm your account with the email sent to ${this.email}`,
                type: 'success'
            }, () => this.router.navigate('/'));
        }).catch(err => {
            toastr.error(err.content.message, null, {
                progressBar: true
            });
        });
    }
}
