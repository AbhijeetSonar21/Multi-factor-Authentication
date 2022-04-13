import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatStepper } from '@angular/material/stepper';
import {MatSnackBar} from '@angular/material/snack-bar';

import { EventEmitter, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

// import '../../../assets/js/smtp.js';
import '../../assets/js/smtp.js';
declare let Email:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // camera code
          // webcamImage: WebcamImage;
        // webcamImage: WebcamImage | undefined;
        @Output() getPicture = new EventEmitter<WebcamImage>();
        showWebcam = true;
        isCameraExist = true;

        errors: WebcamInitError[] = [];

        // webcamImage: WebcamImage;
        // webcamImage: WebcamImage | undefined;

        // webcam snapshot trigger
        private trigger: Subject<void> = new Subject<void>();
        private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  // camera code end

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  otp : any;
  seconds = 125;
  resend = false;
  auth2 = false;
  email : any;
  otp_count = 0;
  // completed_auth1 = false;
  constructor(private _snackBar: MatSnackBar, private router: Router,private _formBuilder: FormBuilder,  private _authService:AuthService) {
    
    this.firstFormGroup = this._formBuilder.group({
      UserName:[null,Validators.compose([Validators.required])],
      Password:[null,Validators.compose([Validators.required])],
    });
    this.secondFormGroup = this._formBuilder.group({
      otp: ['', Validators.required],
    });
   }

  ngOnInit(): void {

    // camera code
        WebcamUtil.getAvailableVideoInputs()
        .then((mediaDevices: MediaDeviceInfo[]) => {
          this.isCameraExist = mediaDevices && mediaDevices.length > 0;
        });
    // camera code ends

  }

  submit() {
    this.router.navigate(['/home']);
  }

  start_timer() {
    this.seconds = this.seconds - 1;
    if( this.seconds > 0) {
      setTimeout(() => this.start_timer(), 1000)
    }
    else {
      this.resend = true;
    }
  }

  auth_1(auth:any,stepper: MatStepper) {
    console.log(auth);
    stepper.next();

    this._authService.auth_1(auth).subscribe(
      (res:any)=>{
        if (res.status == "failed") {
          console.log(res.status)
          this.openSnackBar("Incorrect Username or Password ⚠️❌","OK");
          stepper.previous();
        }
        if (res.status == "success"){
          stepper.next();
          this.otp = res.otp
          this.email = res.email
          console.log(res)
          this.start_timer()
        }
      },
      (err:any)=>{
          console.log(err)
      }
    )
  }

  resend_auth_2() {
    this.auth2 = false;

    let auth = {"email":this.email}

    this._authService.auth_2(auth).subscribe(
      (res:any)=>{
          console.log(res)
          this.otp = res.otp
      },
      (err:any)=>{
          console.log(err)
      }
    )

    this.seconds = 0;
    this.resend = false;
    this.seconds = 125;
    this.start_timer();

  }

  auth_2(auth:any,stepper: MatStepper) {
    this.auth2 = true;
    this.otp_count ++;
    console.log(auth,this.otp_count);
    this.resend = true;
    if (auth.otp == this.otp) {
      stepper.next();
    }
    else {
      // if (this.otp_count <= 3) {
      //   this.resend = true;
      // }
      this.openSnackBar("Incorrect OTP ⚠️❌" + "Attempt" + this.otp_count,"OK");
      if (this.otp_count ==3 ) {
        this.auth2 = true;
        this.resend = false;
        this.openSnackBar("Limit Exceeded ⚠️❌","OK");
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 2000,
      panelClass: ['custom_snackbar']
    });
  }



// camera code
        takeSnapshot(): void {
          this.trigger.next();
        }

        onOffWebCame() {
          this.showWebcam = !this.showWebcam;
        }

        handleInitError(error: WebcamInitError) {
          this.errors.push(error);
        }

        changeWebCame(directionOrDeviceId: boolean | string) {
          this.nextWebcam.next(directionOrDeviceId);
        }

        handleImage(webcamImage: WebcamImage) {
          webcamImage = webcamImage;
          // console.log(webcamImage.imageAsDataUrl);
          this.getPicture.emit(webcamImage);
          this.showWebcam = false;
          this._authService.auth_3({"image_data":webcamImage.imageAsDataUrl}).subscribe(
            (res:any)=>{
              if (res.status == "failed") {
                console.log(res.status)
                // this.openSnackBar("Incorrect Username or Password ⚠️❌","OK");
              }
              if (res.status == "success"){
                console.log(res.status)
              }
            },
            (err:any)=>{
                console.log(err)
            }
          )
        }

        get triggerObservable(): Observable<void> {
          return this.trigger.asObservable();
        }

        get nextWebcamObservable(): Observable<boolean | string> {
          return this.nextWebcam.asObservable();
        }
// camera code ends


}
