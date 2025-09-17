package com.changhu.mylocation

// 日志打印
import android.util.Log
// 高德定位 SDK
import com.amap.api.location.*
// React Native 桥接相关
import com.facebook.react.bridge.*

// 自定义的原生模块，继承 ReactContextBaseJavaModule
// 这样才能在 RN 里通过 NativeModules.MyAmapLocation 来调用
class MyAmapLocationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    // 高德定位客户端对象
    private var mLocationClient: AMapLocationClient? = null

    // 模块名称（JS 调用时使用的名字）
    override fun getName(): String = "MyAmapLocation"

    /**
     * RN 里调用的方法：
     * NativeModules.MyAmapLocation.startLocation().then(...)
     *
     * @param promise RN 的 Promise，用于返回成功或失败结果
     */
    @ReactMethod
    fun startLocation(promise: Promise) {
        try {
            // 1. 初始化定位客户端
            mLocationClient = AMapLocationClient(reactContext)

            // 2. 配置定位参数
            val option = AMapLocationClientOption()
            option.locationMode = AMapLocationClientOption.AMapLocationMode.Hight_Accuracy // 高精度模式
            option.isOnceLocation = true   // 单次定位（调用一次就返回结果并结束）
            option.isNeedAddress = true    // 返回详细地址信息
            mLocationClient?.setLocationOption(option)

            // 3. 定义定位监听器（回调函数）
            val listener = AMapLocationListener { amapLocation ->
                if (amapLocation != null) {
                    if (amapLocation.errorCode == 0) {
                        // 定位成功
                        val map = Arguments.createMap().apply {
                            putDouble("latitude", amapLocation.latitude)   // 纬度
                            putDouble("longitude", amapLocation.longitude) // 经度
                            putString("address", amapLocation.address)     // 地址
                            putString("provider", amapLocation.provider)   // 提供方（gps / network）
                        }
                        Log.d("MyAmapLocation", "定位成功: $map")
                        promise.resolve(map) // 把数据传回给 RN
                    } else {
                        // 定位失败
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
                    // 返回结果为空
                    promise.reject("AMAP_NULL", "定位结果为空")
                }

                // 销毁客户端（释放内存，否则会泄漏）
                mLocationClient?.onDestroy()
            }

            // 4. 设置监听器
            mLocationClient?.setLocationListener(listener)

            // 5. 启动定位
            mLocationClient?.startLocation()
        } catch (e: Exception) {
            // 如果上面初始化或调用出错，直接返回异常
            promise.reject("AMAP_EXCEPTION", e.message)
        }
    }
}
