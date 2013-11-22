MobileFrameZeroTools
====================

Mobile tools for the Mobile frame Zero Lego wargame.

The overall design philosophy is to keep things simple so that the greatest number of people can help out on this project.

This application is based on the following frameworks :

	*) PhoneGap (2.8.0);
	*) jQuery (1.10.2);
	*) jQuery.i18n.properties (1.0.9);
	*) Knockout.js (3.0.0);
	*) Bootstrap (3.0.0).
	
Devices tested on :

	*) Google Nexus 7;
	*) Asus Transformeer Prime;
	*) HTC Desire;
	*) Nexus Galaxy.
	
Should be compatible with (tests needed) :

	*) Nexus 4;
	*) HTC Amaze 4G;
	*) Motorola Droid 4;
	*) Motorola Droid Bionic.

Here's a walk-through to use the ADT :

1. Install the Android Developer Tools (I have build v21.0.1-543035 which is based on Eclipse Juno);
2. Connect your device to the PC and activate the USB debug mod;
3. Uninstall the application if it's already on your device and doesn't correspond to a version that was installed in debug mod by your Eclipse;
4. Launch the ADT and create a workspace;
5. Clone the repository to workspace/MobileFrameZeroTools;
6. In Eclipse, right-click in the package explorer zone to import>Android>Existing Android Code Into Workspace;
7. Unfold the src folder and its contents to select the MobileFrameZeroToolsMainActivity class;
8. Click on the debug button, a Debug As window opens;
9. Choose Android Application and press OK;
10. Wait a bit till the application launches on your device (you may get an Eclipse window that asks you to choose your device).
 
Main Git branch organisation (follows Git Flow) :
	*) master : main branch;
	*) hotfix : quick corrections;
	*) develop : stable development branch before release version;
	*) feature : you branch from here when a new feature needs coding.
