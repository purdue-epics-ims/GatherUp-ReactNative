package edu.purdue.epics.ims.react.modules.toast;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

export default class ToastModule extends ReactContextBaseJavaModule {

  @Override
  public String getName() {
    return "UniMag";
  }

  @ReactMethod
  public void show(String message, int duration){
      Toast.makeText(getreactapplicaionContext(), message, duration).show();
  }

  public UniMag(ReactApplicationContext reactContext) {
    super(reactContext);
  }

}
