package com.maria_sube.cedric.mobileframezerotools;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class MobileFrameZeroToolsMainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mobile_frame_zero_tools_main);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.activity_mobile_frame_zero_tools_main, menu);
        return true;
    }
    
}
