# Ionic QR Scanner GUI #

This component creates an out-of-the-box QR scanner GUI and manages the [QRScanner Natove Plugin](https://ionicframework.com/docs/native/qr-scanner/) plugin in a straightforward way:

```
<qr-scanner color="white" [defaultOn]="true" (Scan)="onTextScanned($event)" #scanner></qr-scanner>
```

## Usage ##

1 Install thi package:

```
$ npm install ionic-qrscanner-gui
```

2 Add the component to your app's main module:

```
// #app.module.ts

@NgModule({
	imports: [
		QrScannerComponentModule	// <-- Add this line
	],
	entryComponents: [
		MyApp,
		YourScannertPage,
	],
	//...
})
```

...or to the page's hosting the scanner (if it has a module definition file):

```
// #your-scanner-page.module.ts

@NgModule({
	declarations: [
		YourScannerPage,
	],
	imports: [
		IonicPageModule.forChild(DashboardPage),
		QrScannerComponentModule					// <-- Add this line
	],
	//...
})
```


3 Add the component's stylesheet into `variables.scss`:

```
@import 'node_modules/ionic-qrscanner-gui/dist/qr-scanner.scss';
```




### Inputs ###

* `defaultOn:`: If true, turns the camera on and starts scanning on startup. Default is `true`.
* `Scan`: Event triggered on finding a text string in a QR code, passes the text as parameter.