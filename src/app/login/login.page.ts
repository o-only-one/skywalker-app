import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DataService} from '../service/data.service';
import {AppService} from '../service/app.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    userInfo: any;
    userName: string;
    userMobile: string;
    loginType: string;
    userPwd: string;
    showPwd: boolean;
    captchaCodeImg: string;
    codeNumber: string;
    mobileCode: string;

    constructor(
        private location: Location,
        private appService: AppService,
        private dataService: DataService) {
    }

    ngOnInit() {
        this.userName = '';
        this.userMobile = '';
        this.userPwd = '';
        this.loginType = 't-userName';
        this.showPwd = false;
        this.getCaptcha();
    }

    getCaptcha() {
        this.dataService.getCaptcha().subscribe(res => {
            if (res.code !== '0') {
                this.dataService.toastTip(res.message);
            } else {
                this.captchaCodeImg = res.data;
            }
        });
    }

    logIn() {
        if (this.loginType === 't-userName') {
            if (!this.userName) {
                this.dataService.toastTip('请填写用户名');
                return;
            }
            if (!this.userPwd) {
                this.dataService.toastTip('请填写密码');
                return;
            }
        }
        if (this.loginType === 't-mobile') {
            if (!this.userMobile) {
                this.dataService.toastTip('请填写手机号');
                return;
            }
            if (!this.mobileCode) {
                this.dataService.toastTip('请填写手机验证码');
                return;
            }
        }
        if (!this.codeNumber) {
            this.dataService.toastTip('请填写验证码');
            return;
        }
        this.dataService.accountLogin(this.userName, this.userPwd, this.codeNumber).subscribe(res => {
            if (res.code !== '0') {
                this.getCaptcha();
                this.dataService.toastTip(res.message);
            } else {
                this.dataService.setStore('authorization', res.data);
                this.getHeadImg();
                this.getUserInfo();
                this.location.back();
            }
        });
    }

    getHeadImg() {
        this.dataService.getData('users/headImg').subscribe(
            res => {
                if (null != res && res.code === '0' && res.data != null) {
                    this.dataService.setStore('headImg', 'data:image/jpg;base64,' + res.data);
                    this.appService.userInfoEvent.emit('update');
                }
            }
        );
    }

    getUserInfo() {
        this.dataService.getDataLogin('users/myinfo').subscribe(res => {
            if (null != res && res.code === '0' && res.data != null) {
                this.dataService.setStore('userInfo', res.data);
                this.appService.userInfoEvent.emit('update');
            }
        });
    }
}
