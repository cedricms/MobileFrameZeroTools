package com.maria_sube.cedric.mobileframezerotools;

import org.apache.cordova.DroidGap;

import android.os.Bundle;

public class MobileFrameZeroToolsMainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_mobile_frame_zero_tools_main);
        super.loadUrl("file:///android_asset/www/index.html");
    }

//    @Override
//    public boolean onCreateOptionsMenu(Menu menu) {
//        // Inflate the menu; this adds items to the action bar if it is present.
//        getMenuInflater().inflate(R.menu.activity_mobile_frame_zero_tools_main, menu);
//        return true;
//    }
    
}
