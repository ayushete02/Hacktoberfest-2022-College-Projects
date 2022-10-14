package com.example.projectfinal.model

import androidx.annotation.DrawableRes
import androidx.annotation.StringRes

data class HomeSequence (
    @DrawableRes val imageResourceIdProf:Int,
    @StringRes val stringResourceIdName:Int,
    @StringRes val stringResourceIdReg:Int,
    @StringRes val stringResourceIdBatch:Int,
){}