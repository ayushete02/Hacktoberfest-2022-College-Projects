package com.example.projectfinal.data

import com.example.projectfinal.R
import com.example.projectfinal.model.HomeSequence

class DataHomeSource() {
        fun loadDataSequence(): HomeSequence {
            return HomeSequence(R.drawable.profl,R.string.profile_name,R.string.profile_reg,
                            R.string.profile_batch)
        }
    }
