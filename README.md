# **Accelerator-UI**

User Interface developed using Lightning Application Framework for RDK’s Video Accelerator Platform

## **Building the App**

1. Pre-requisites:
   * Install Node.js 10.x and npm 
   * Install Lightning-CLI globally\
       `npm install -g @lightningjs/cli`  
   (There is a new lightning version release dated 14 Oct 2020, if you are already using lightning , then please refer 'Lightning carbon release' section before moving to next steps)   
      
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

1. Launch Controller UI in your web browser by giving IP address and port number of the device/box (eg: http://192.168.1.6:9998/ ).
2. In  Controller UI, navigate to Resident App tab
3. Enter the Application URL ( URL of the application getting from 'lng serve' ) in 'Custom URL' field and click on 'SET' button. 
4. The Lightning accelerator UI will get loaded in the Resident App(webkit browser instance)

 

## **Keys Used for Navigation**

| Keys used in Remote    | Keys used in Keyboard |
| :--------------------- | :-------------------- |
| Home                   | Backspace             |
| Up Arrow               | Up Arrow              |
| Down Arrow             | Down Arrow            |
| Right Arrow            | Right Arrow           |
| Left Arrow             | Left Arrow            |
| OK                     | Enter                 |
| Volume Up              |  -                    |
| Volume Down            |  -                    |
| Mute                   |  -                    |



## **Lightning Carbon Release**

If you have already installed lightning cli version < 2.0.0 , then to upgrade to lightning CLI  2.0.0, please follow the below steps 

1. Uninstall the old version: `npm uninstall -g wpe-lightning-cli`
2. Install the latest lightning cli `npm install -g @lightningjs/cli`

Release document - http://www.lightningjs.io/announcements/carbon-release



## **Documentation**

For  further information refer https://wiki.rdkcentral.com/display/ASP/Tata+Elxsi+Accelerator+UI
