package com.application;

import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UniMagModule extends ReactContextBaseJavaModule{


  public UniMagModule(ReactApplicationContext reactContext){
        super(reactContext);
    }

  @Override
  public String getName() {
    return "UniMagModule";
  }

  @ReactMethod
  public void increment(int i, Callback successCallback){
      successCallback.invoke(i+1);
  }
}
