# **Accelerator-UI**

User Interface developed using Lightning Application Framework for RDK’s Video Accelerator Platform

## **Building the App**

1. Pre-requisites:
   * Install Node.js 10.x and npm 
   * Install Lightning-CLI globally\
       `npm install -g rdkcentral/Lightning-CLI`   
      
2. Clone the Accelerator-UI project 
   `git clone git@github.com:rdkcentral/AcceleratorUI.git`

3. Navigate to the project folder in terminal

4. Run: `npm install` or  `sudo npm install`\
   It will download all the dependent packages.
   
5. Run `lng build` : will create a standalone bundle that you can run in the browser.

6. Run `lng serve` : will start a local webserver and run the App.
   The port information  and the host IP information of the server will be shown in the terminal.
   Application will be up and will run at (http://{hostIP}:8080)\
   eg: http://127.0.0.1:8080, http://192.168.1.8:8080
   
## **Launch the application on Accelerator box**

Prerequisites - The device and your machine should be connected to the same network.

1. Launch Thunder Controller UI in your web browser by giving IP address of the device/box (eg: http://192.168.1.6/ ).
2. In Thunder Controller UI, navigate to UX tab
3. Enter the Application URL ( URL of the application getting from 'lng serve' ) in 'Custom URL' field and click on 'SET' button. 
4. The Lightning accelerator UI will get loaded in the UX(webkit browser instance)

 

## **Keys Used for Navigation**

| Keys used in Remote    | Keys used in Keyboard |
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
