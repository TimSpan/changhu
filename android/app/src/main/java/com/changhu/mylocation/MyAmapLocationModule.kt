package com.changhu.mylocation

import android.util.Log
import com.amap.api.location.*
import com.facebook.react.bridge.*

class MyAmapLocationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var mLocationClient:AMapLocationClient ? = null

    override fun getName(): String = "MyAmapLocation"

    @ReactMethod
    fun startLocation(promise: Promise) {
        try {
            // 初始化定位
            mLocationClient = AMapLocationClient(reactContext)

            // 设置参数
            val option = AMapLocationClientOption()
            option.locationMode = AMapLocationClientOption.AMapLocationMode.Hight_Accuracy
            option.isOnceLocation = true  // 单次定位
            option.isNeedAddress = true   // 是否需要地址信息
            mLocationClient?.setLocationOption(option)

            // 设置监听回调
            val listener = AMapLocationListener { amapLocation ->
                if (amapLocation != null) {
                    if (amapLocation.errorCode == 0) {
                        val map = Arguments.createMap().apply {
                            putDouble("latitude", amapLocation.latitude)
                            putDouble("longitude", amapLocation.longitude)
                            putString("address", amapLocation.address)
                            putString("provider", amapLocation.provider)
                        }
                        Log.d("MyAmapLocation", "定位成功: $map")
                        promise.resolve(map)
                    } else {
                        Log.e(
                            "MyAmapLocation",
                            "定位失败: code=${amapLocation.errorCode}, info=${amapLocation.errorInfo}"
                        )
                        promise.reject(
                            "AMAP_ERROR",
                            "定位失败: ${amapLocation.errorCode} - ${amapLocation.errorInfo}"
                        )
                    }
                } else {
                    promise.reject("AMAP_NULL", "定位结果为空")
                }
                mLocationClient?.onDestroy()
            }

            mLocationClient?.setLocationListener(listener)

            // 启动定位
            mLocationClient?.startLocation()
        } catch (e: Exception) {
            promise.reject("AMAP_EXCEPTION", e.message)
        }
    }
}
