import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  constructor(private router: Router,private _formBuilder: FormBuilder) {
    this.formValidation();
    
    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required],
      userName:[null,Validators.compose([Validators.required])],
      password:[null,Validators.compose([Validators.required])],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
   }
   formValidation(){
    this.firstFormGroup =  this._formBuilder.group({
      userName:[null,Validators.compose([Validators.required])],
      password:[null,Validators.compose([Validators.required])],
    });
    }

  ngOnInit(): void {
  }

  submit() {
    this.router.navigate(['/home']);
  }

}
