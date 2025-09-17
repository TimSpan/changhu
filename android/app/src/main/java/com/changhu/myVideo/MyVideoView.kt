package com.changhu.myVideo

import android.content.Context
import android.net.Uri
import android.widget.FrameLayout
import android.widget.MediaController
import android.widget.VideoView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class MyVideoView(context: Context) : FrameLayout(context) {
    private val videoView = VideoView(context)
    private val mediaController = MediaController(context)

    init {
        videoView.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        videoView.setMediaController(mediaController)
        mediaController.setAnchorView(videoView)
        addView(videoView)
    }

    fun setVideoUri(uri: String) {
        videoView.setVideoURI(Uri.parse(uri))
        videoView.requestFocus()
    }

    fun start() {
        videoView.start()
    }

    fun pause() {
        videoView.pause()
    }
}

class MyVideoViewManager : SimpleViewManager<MyVideoView>() {
    override fun getName(): String = "MyVideoView"

    override fun createViewInstance(reactContext: ThemedReactContext): MyVideoView {
        return MyVideoView(reactContext)
    }

    @ReactProp(name = "videoUri")
    fun setVideoUri(view: MyVideoView, uri: String?) {
        uri?.let {
            view.setVideoUri(it)
        }
    }


}
