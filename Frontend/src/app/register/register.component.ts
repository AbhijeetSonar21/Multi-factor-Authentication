import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  firstFormGroup: FormGroup;
  imageData : any;
  user : any;

  constructor(private _formBuilder: FormBuilder,  private _authService:AuthService) {
    this.firstFormGroup = this._formBuilder.group({
      UserName:[null,Validators.compose([Validators.required])],
      Password:[null,Validators.compose([Validators.required])],
      name:[null,Validators.compose([Validators.required])],
      email:[null,Validators.compose([Validators.required])],
      image:['', Validators.required],
    });
   }

  ngOnInit(): void {
  }

  new(user:any) {

    // https://stackoverflow.com/questions/58111929/why-i-get-malformed-utf-8-data-error-on-crypto-js
    // let username = this.encrypt(user.UserName);
    // let dusername = this.decrypt(username);
    // console.log(username)
    // let decrypt = JSON.parse(dusername);
    // console.log(decrypt.text)

    this.user = {
      "username" : this.encrypt(user.UserName),
      "password" : this.encrypt(user.Password),
      "name" : this.encrypt(user.name),
      "email" : user.email,
      // "email" : this.encrypt(user.email),
      "image" : this.imageData
    }

    console.log(this.user)

    this._authService.new_user(this.user).subscribe(
      (res:any)=>{
    })
  }


  handleFileInput(event: any) {

    const reader = new FileReader();
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageData = reader.result;
        console.log(reader.result)
      };
  }

  encrypt(text:any) {
    const cryptoInfo = CryptoJS.AES.encrypt(JSON.stringify({ text }), 'secret').toString();
    return cryptoInfo
  }

  decrypt(text:any) {
    let decrypted = CryptoJS.AES.decrypt(text.toString(), 'secret');
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

}
