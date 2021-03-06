import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  FormControl
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

function passwordValidator(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    return control.value.length < length
      ? {
          passwordTooShort: {
            requiredLength: length,
            actualLength: control.value.length
          }
        }
      : null;
  };
}

function comparePasswords(control: AbstractControl): { [key: string]: any } {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password.value === confirmPassword.value
    ? null
    : { passwordsDiffer: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public user: FormGroup;
  public errorMsg: string;
  private fileUploaded = null;


  get passwordControl(): FormControl {
    return <FormControl>this.user.get('passwordGroup').get('password');
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.user = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(4)],
        this.serverSideValidateUsername()
      ],
      passwordGroup: this.fb.group(
        {
          password: ['', [Validators.required, passwordValidator(6)]],
          confirmPassword: ['', Validators.required]
        },
        { validator: comparePasswords }
      ),
      file: [null, Validators.required]
    });
  }

  serverSideValidateUsername(): ValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any }> => {
      return this.authenticationService
        .checkUserNameAvailability(control.value)
        .pipe(
          map(available => {
            if (available) {
              return null;
            }
            return { userAlreadyExists: true };
          })
        );
    };
  }

  onSubmit() {
    console.log(this.fileUploaded);
    let fd = new FormData();
    fd.append("image", this.fileUploaded, this.fileUploaded.name);
    this.authenticationService.uploadFile(fd).subscribe(res => {
      console.log(res);
      let avatar = res;
      this.authenticationService
      .register(this.user.value.username, this.passwordControl.value, avatar)
      .subscribe(
        val => {
          if (val) {
            this.router.navigate(['/questions']);
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMsg = `Error ${
            error.status
          } while trying to register user ${this.user.value.username}: ${
            error.error
          }`;
        }
      );
    })
    
  }
    onFileSelected(event) {
      console.log(event);
      this.fileUploaded = event.target.files[0];
    }
}
