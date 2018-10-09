import { ElementRef, EventEmitter } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Platform } from 'ionic-angular';
/**
 * This component creates a QR scanner GUI and manages the
 * [QRScanner Natove Plugin](https://ionicframework.com/docs/native/qr-scanner/) plugin
 * in a straightforward way.
 */
export declare class QrScannerComponent {
    private elemetRef;
    private platform;
    qrScanner: QRScanner;
    /**
     * QR scanner's default frame color.
     */
    color: string;
    /**
     * If true, turns the camera on and starts scanning on startup. Default is true.
     */
    defaultOn: boolean;
    /**
     * Event triggered on finding a text string in a QR code.
     */
    Scan: EventEmitter<string>;
    private rootApp;
    private scanSubscription;
    private ready;
    private OSAllosOpenSettings;
    constructor(elemetRef: ElementRef, platform: Platform, qrScanner: QRScanner);
    private ngOnInit();
    /**
     * Shortcut for qrScanner.openSettings(): will attempt to open the settings
     * to let user give camera permissions to this app.
     */
    openSettings(): void;
    /**
     * Call this before turning the scanner on.
     * @param handleMissingPermissions Callback function to handle the missing permissions and ask
     * the user to authorize the app to use the camera. Usually what would do is call
     * QRScannerCompoent.openSettings() (if the OS allows it) or any other handler or method
     * to get the user give the needed permissions.
     */
    init(handleMissingPermissions?: (canOpenSettings: boolean) => {}): Promise<boolean>;
    /**
     * Start looking for QR codes in the image.
     */
    startScanning(): void;
    /**
     * Stop looking for QR codes in the image. The camera will not
     * shut down until calling turnOff().
     */
    stopScanning(): void;
    /**
     * Tunrs camera on and starts looking for QR codes in the image.
     */
    turnOn(): void;
    /**
     * Stops looking for QR codes and shuts the camera down.
     */
    turnOff(): void;
}
