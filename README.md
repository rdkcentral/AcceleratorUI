# **Accelerator-UI**

## **Getting started**

> Before you follow the steps below, make sure you have the
> [Lightning-CLI](https://github.com/WebPlatformForEmbedded/Lightning-CLI) installed _globally_ on your system

```
npm install -g rdkcentral/Lightning-CLI
```

## **Building the App**

1. Pre-requisites:
   Installation of Node.js 10.x, npm and Lightning-CLI (reference)
2. Clone the Accelerator-UI project
   git clone
3. Navigate to the project location in terminal
4. Run: `npm install`\
   It downloads all the dependent packages.
5. `lng build` : will create a standalone bundle that you can run in the browser.
6. `lng serve` : will start a local webserver and run the App.
   The port information of the server will be shown in the terminal.
7. `lng dev` : will build the App and start the webserver.
   Besides it watches for the changes while running the App.\

   Application will be up and running locally on local host (http://127.0.0.1:8080)

## **Keys Used for Navigation**

| Buttons used in Remote | Keys used in Keyboard |
| :--------------------- | :-------------------- |
| Menu                   | Backspace             |
| Up Arrow               | Up Arrow              |
| Down Arrow             | Down Arrow            |
| Right Arrow            | Right Arrow           |
| Left Arrow             | Left Arrow            |
| OK                     | Enter                 |
| Volume Up              | W                     |
| Volume Down            | S                     |
| Mute                   | M                     |


## **Known Issues**
1. In Bluetooth Pairing, connected devices will remain as ‘Ready’,  even after disconnect operation

2. Sometimes a black overlay is shown over Volume UI on continuous key presses


## **Documentation**

For  further information refer https://wiki.rdkcentral.com/display/ASP/Tata+Elxsi+Accelerator+UI

