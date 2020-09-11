# **Accelerator-UI**

Accelerator UI using Lightning application Framework for RDK’s Video Accelerator Platforms

## **Building the App**

1. Pre-requisites:
   * Install Node.js 10.x and npm 
   * Install Lightning-CLI globally\
       `npm install -g rdkcentral/Lightning-CLI`
   

  
       
2. Clone the Accelerator-UI project using 
   `git clone git@github.com:rdkcentral/AcceleratorUI.git`

3. Navigate to the project folder in terminal
4. Run: `npm install` or  `sudo npm install`\
   It will download all the dependent packages.
5. Run `lng build` : will create a standalone bundle that you can run in the browser.
6. Run `lng serve` : will start a local webserver and run the App.
   The port information of the server will be shown in the terminal.
   Application will be up and will run locally on local host (http://127.0.0.1:8080)
7. `lng dev` : will build the App and start the webserver.Besides it watches for the changes while running the App thus automatically restarts the local webserver for changes.

   

## **Keys Used for Navigation**

| Buttons used in Remote | Keys used in Keyboard |
| :--------------------- | :-------------------- |
| Menu                   | Backspace             |
| Up Arrow               | Up Arrow              |
| Down Arrow             | Down Arrow            |
| Right Arrow            | Right Arrow           |
| Left Arrow             | Left Arrow            |
| OK                     | Enter                 |
| Volume Up              |  -                    |
| Volume Down            |  -                    |
| Mute                   |  -                    |


## **Known Issues**
1. In Bluetooth Pairing, connected devices will remain as ‘Ready’,  even after disconnect operation

2. Sometimes a black overlay is shown over Volume UI on continuous key presses


## **Documentation**

For  further information refer https://wiki.rdkcentral.com/display/ASP/Tata+Elxsi+Accelerator+UI