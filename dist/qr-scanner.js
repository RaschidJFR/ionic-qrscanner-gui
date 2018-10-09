"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
/**
 * This component creates a QR scanner GUI and manages the
 * [QRScanner Natove Plugin](https://ionicframework.com/docs/native/qr-scanner/) plugin
 * in a straightforward way.
 */
var QrScannerComponent = /** @class */ (function () {
    function QrScannerComponent(elemetRef, platform, qrScanner) {
        this.elemetRef = elemetRef;
        this.platform = platform;
        this.qrScanner = qrScanner;
        /**
         * If true, turns the camera on and starts scanning on startup. Default is true.
         */
        this.defaultOn = true;
        /**
         * Event triggered on finding a text string in a QR code.
         */
        this.Scan = new core_1.EventEmitter();
        this.OSAllosOpenSettings = false;
    }
    QrScannerComponent.prototype.ngOnInit = function () {
        // Scanner 
        var scannerElement = this.elemetRef.nativeElement;
        // Icon
        var frameIcon = scannerElement.getElementsByClassName('icon')[0];
        frameIcon.style.color = this.color;
        // Page
        var parentPage = scannerElement.closest('.ion-page');
        parentPage.classList.add('dont-hide');
        // App
        this.rootApp = scannerElement.closest('ion-app');
        if (!this.platform.is('cordova'))
            this.rootApp.classList.add('qr-scanner-debug');
        if (this.defaultOn === true)
            this.init();
    };
    /**
     * Shortcut for qrScanner.openSettings(): will attempt to open the settings
     * to let user give camera permissions to this app.
     */
    QrScannerComponent.prototype.openSettings = function () {
        this.qrScanner.openSettings();
    };
    /**
     * Call this before turning the scanner on.
     * @param handleMissingPermissions Callback function to handle the missing permissions and ask
     * the user to authorize the app to use the camera. Usually what would do is call
     * QRScannerCompoent.openSettings() (if the OS allows it) or any other handler or method
     * to get the user give the needed permissions.
     */
    QrScannerComponent.prototype.init = function (handleMissingPermissions) {
        var _this = this;
        if (this.ready)
            return this.ready;
        if (this.platform.is('cordova')) {
            // Optionally request the permission early
            this.ready = this.qrScanner.prepare()
                .then(function (status) {
                _this.OSAllosOpenSettings = status.canOpenSettings;
                if (status.authorized) {
                    // camera permission was granted
                    console.log('camera permission granted');
                    return true;
                }
                else if (status.denied) {
                    // camera permission was permanently denied
                    // you must use QRScanner.openSettings() method to guide the user to the settings page
                    // then they can grant the permission from there
                    console.log('camera permission denied this time');
                    handleMissingPermissions(status.canOpenSettings);
                    return false;
                }
                else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                    console.error('camera permission denied permanently');
                    return false;
                }
            });
        }
        else {
            this.ready = Promise.resolve(true);
        }
        return this.ready;
    };
    /**
     * Start looking for QR codes in the image.
     */
    QrScannerComponent.prototype.startScanning = function () {
        var _this = this;
        if (!this.ready)
            throw 'You must first call init()';
        if (!this.scanSubscription)
            this.scanSubscription = this.qrScanner.scan().subscribe(function (text) {
                console.log('Scanned: %o', text);
                _this.stopScanning();
                _this.Scan.emit(text);
            }, function (error) { return console.error(error); });
    };
    /**
     * Stop looking for QR codes in the image. The camera will not
     * shut down until calling turnOff().
     */
    QrScannerComponent.prototype.stopScanning = function () {
        if (!this.scanSubscription)
            this.scanSubscription.unsubscribe();
        this.scanSubscription = null;
    };
    /**
     * Tunrs camera on and starts looking for QR codes in the image.
     */
    QrScannerComponent.prototype.turnOn = function () {
        var _this = this;
        console.log("QRScanner on");
        // If cordova device
        if (this.platform.is('cordova')) {
            this.startScanning();
            this.qrScanner.show()
                .then(function () {
                // Make the app css visible for the scanner
                _this.rootApp.classList.add('show-qr-scanner');
                _this.rootApp.setAttribute('show-qr-scanner', 'true');
            })["catch"](function (error) {
                console.error(error);
            });
            // if web browser (debug)
        }
        else {
            this.rootApp.classList.add('show-qr-scanner');
            this.rootApp.setAttribute('show-qr-scanner', 'true');
        }
    };
    /**
     * Stops looking for QR codes and shuts the camera down.
     */
    QrScannerComponent.prototype.turnOff = function () {
        console.log("QRScanner off");
        this.stopScanning();
        this.rootApp.classList.remove('show-qr-scanner');
        this.rootApp.setAttribute('show-qr-scanner', 'false');
        this.qrScanner.hide()["catch"](function (error) { return console.error(error); });
    };
    __decorate([
        core_1.Input()
    ], QrScannerComponent.prototype, "color");
    __decorate([
        core_1.Input()
    ], QrScannerComponent.prototype, "defaultOn");
    __decorate([
        core_1.Output()
    ], QrScannerComponent.prototype, "Scan");
    QrScannerComponent = __decorate([
        core_1.Component({
            selector: 'qr-scanner',
            templateUrl: 'qr-scanner.html'
        })
    ], QrScannerComponent);
    return QrScannerComponent;
}());
exports.QrScannerComponent = QrScannerComponent;
