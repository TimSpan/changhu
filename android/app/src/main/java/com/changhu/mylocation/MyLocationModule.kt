package com.changhu.mylocation

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.util.Log
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*

class MyLocationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val reactContext: ReactApplicationContext = reactContext

    override fun getName(): String = "MyLocation"

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        val activity: Activity? = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity is null")
            return
        }

        val locationManager =
            activity.getSystemService(Context.LOCATION_SERVICE) as LocationManager

        // 权限检查
        if (ActivityCompat.checkSelfPermission(
                activity,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(
                activity,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            promise.reject("NO_PERMISSION", "Location permission not granted")
            return
        }

        // 获取最近一次已知的位置（快，但可能旧）
        val lastKnown: Location? =
            locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)

        if (lastKnown != null) {
            val map = Arguments.createMap().apply {
                putDouble("latitude", lastKnown.latitude)
                putDouble("longitude", lastKnown.longitude)
            }
            Log.d(
                "11111111111111",
                "11111111111111"
            )
            Log.d(
                "MyLocationModule",
                "定位结果: map=${map}"
            )

            promise.resolve(map)
            return
        }

        // 如果没有已知位置，监听一次新的
        val listener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                val map = Arguments.createMap().apply {
                    putDouble("latitude", location.latitude)
                    putDouble("longitude", location.longitude)
                }
                Log.d(
                    "11111111111111",
                    "11111111111111"
                )
                Log.d(
                    "MyLocationModule",
                    "定位结果: latitude=${location.latitude}, longitude=${location.longitude}"
                )
                promise.resolve(map)
                locationManager.removeUpdates(this)
            }

            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {
                promise.reject("NO_PROVIDER", "Provider disabled")
            }
        }

        locationManager.requestSingleUpdate(LocationManager.GPS_PROVIDER, listener, null)
    }
}
