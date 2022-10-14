package com.example.projectfinal.model

import androidx.annotation.DrawableRes
import androidx.annotation.StringRes

data class TimeSequence (
    @StringRes val stringResourceId:Int,
    @StringRes val stringResourceIdTcr: Int,
    @DrawableRes val imageResourceId: Int
        ){
}