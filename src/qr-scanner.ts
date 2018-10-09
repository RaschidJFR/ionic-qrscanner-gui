import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';

/**
 * This component creates a QR scanner GUI and manages the 
 * [QRScanner Natove Plugin](https://ionicframework.com/docs/native/qr-scanner/) plugin
 * in a straightforward way.
 */
@Component({
  selector: 'qr-scanner',
  templateUrl: 'qr-scanner.html'
})
export class QrScannerComponent {
  /**
   * QR scanner's default frame color.
   */
  @Input() color: string;
  /**
   * If true, turns the camera on and starts scanning on startup. Default is true.
   */
  @Input() defaultOn: boolean = true;
  /**
   * Event triggered on finding a text string in a QR code.
   */
  @Output() Scan = new EventEmitter<string>();

  private rootApp: HTMLElement;
  private scanSubscription: Subscription;
  private ready: Promise<any>;
  private OSAllosOpenSettings = false;

  constructor(private elemetRef: ElementRef,
    private platform: Platform,
    public qrScanner: QRScanner) {
  }

  private ngOnInit(): void {

    // Scanner 
    let scannerElement = this.elemetRef.nativeElement as HTMLElement;

    // Icon
    let frameIcon = scannerElement.getElementsByClassName('icon')[0] as HTMLElement;
    frameIcon.style.color = this.color;

    // Page
    let parentPage = scannerElement.closest('.ion-page');
    parentPage.classList.add('dont-hide');

    // App
    this.rootApp = scannerElement.closest('ion-app') as HTMLElement;
    if (!this.platform.is('cordova')) this.rootApp.classList.add('qr-scanner-debug');

    if (this.defaultOn === true) this.init();
  }

  /**
   * Shortcut for qrScanner.openSettings(): will attempt to open the settings
   * to let user give camera permissions to this app.
   */
  openSettings() {
    this.qrScanner.openSettings();
  }

  /**
   * Call this before turning the scanner on.
   * @param handleMissingPermissions Callback function to handle the missing permissions and ask
   * the user to authorize the app to use the camera. Usually what would do is call 
   * QRScannerCompoent.openSettings() (if the OS allows it) or any other handler or method
   * to get the user give the needed permissions.
   */
  init(handleMissingPermissions?: (canOpenSettings: boolean) => {}): Promise<boolean> {
    if (this.ready) return this.ready;

    if (this.platform.is('cordova')) {

      // Optionally request the permission early
      this.ready = this.qrScanner.prepare()
        .then((status: QRScannerStatus) => {

          this.OSAllosOpenSettings = status.canOpenSettings;

          if (status.authorized) {
            // camera permission was granted
            console.log('camera permission granted');
            return true;

          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            console.log('camera permission denied this time');
            handleMissingPermissions(status.canOpenSettings);
            return false

          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            console.error('camera permission denied permanently');
            return false;
          }
        });

    } else {
      this.ready = Promise.resolve(true);
    }
    return this.ready;
  }

  /**
   * Start looking for QR codes in the image.
   */
  startScanning() {
    if (!this.ready) throw 'You must first call init()';

    if (!this.scanSubscription)
      this.scanSubscription = this.qrScanner.scan().subscribe(
        (text: string) => {
          console.log('Scanned: %o', text);
          this.stopScanning();
          this.Scan.emit(text);
        },
        (error: any) => console.error(error));

  }

  /**
   * Stop looking for QR codes in the image. The camera will not
   * shut down until calling turnOff().
   */
  stopScanning() {
    if (!this.scanSubscription) this.scanSubscription.unsubscribe();
    this.scanSubscription = null;
  }

  /**
   * Tunrs camera on and starts looking for QR codes in the image.
   */
  turnOn() {
    console.log("QRScanner on");

    // If cordova device
    if (this.platform.is('cordova')) {

      this.startScanning();
      this.qrScanner.show()
        .then(() => {
          // Make the app css visible for the scanner
          this.rootApp.classList.add('show-qr-scanner');
          this.rootApp.setAttribute('show-qr-scanner', 'true');
        }).catch(error => {
          console.error(error);
        });

      // if web browser (debug)
    } else {
      this.rootApp.classList.add('show-qr-scanner');
      this.rootApp.setAttribute('show-qr-scanner', 'true');
    }
  }

  /**
   * Stops looking for QR codes and shuts the camera down.
   */
  turnOff() {
    console.log("QRScanner off");
    this.stopScanning();
    this.rootApp.classList.remove('show-qr-scanner');
    this.rootApp.setAttribute('show-qr-scanner', 'false');
    this.qrScanner.hide().catch(error => console.error(error));
  }
}
